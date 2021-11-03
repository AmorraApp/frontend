
import { forwardRef, useCallback, useRef, useMemo, useLayoutEffect } from "react";
import PropTypes from 'prop-types';
import {
  useDefer,
  useDeferredLoop,
} from 'common/hooks/useTimers';
import useSilentState from 'common/hooks/useSilentState';
import useDerivedState from 'common/hooks/useDerivedState';
import usePrevious from 'common/hooks/usePrevious';

import MaskUtils from "./mask";
import parseMask from "./parse-mask";
import { deepEqual } from 'common/utils';

const propTypes = {
  as: PropTypes.elementType,
  value: PropTypes.string,
  mask: PropTypes.string,
  alwaysShowMask: PropTypes.bool,
  maskPlaceholder: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  tabIndex: PropTypes.number,
};

const defaultProps = {
  alwaysShowMask: false,
  maskPlaceholder: "_",
  tabIndex: 0,
};

const MaskedInput = forwardRef(({
  value: _value,
  mask,
  alwaysShowMask,
  maskPlaceholder,
  as: Component = 'input',
  ...props
}, ref) => {

  if (!ref) ref = useRef();

  const maskUtils = useMemo(() => new MaskUtils(parseMask({ mask, maskPlaceholder }), [ mask, maskPlaceholder ]));

  const [ focusedAtRender, setFocusState, getFocusState ] = useSilentState(false);

  const baseValue = focusedAtRender || alwaysShowMask || _value
    ? maskUtils.formatValue(_value)
    : ''
  ;
  const [ , setValueState, getValueState ] = useDerivedState(baseValue, [ _value ]);

  const [ , setSelectionState, getSelectionState ] = useSilentState({ start: null, end: null, length: 0 });

  const updateLoop = useDeferredLoop(
    useCallback(() => {
      setSelectionState(getInputSelection(ref.current));
    }),
  );

  const defer = useDefer();

  const setInputState = useCallback(({ value, selection }) => {
    if (deepEqual(value, getValueState()) && deepEqual(selection, getSelectionState())) return;
    setValueState(value);
    setSelectionState(selection);

    if (ref.current) {
      ref.current.value = value;
      if (getFocusState()) setInputSelection(ref.current, selection);
    }
  }, [ ref, setValueState, setSelectionState ]);

  const onChange = useCallback(() => {
    const currentState = { value: ref.current.value, selection: getInputSelection(ref.current) };
    const previousState = { value: getValueState(), selection: getSelectionState() };

    const newInputState = maskUtils.processChange(currentState, previousState);

    const changed = newInputState.value !== previousState.value;

    setInputState(newInputState);

    if (changed && props.onChange) props.onChange(newInputState.value);
  }, [ setInputState, getSelectionState ]);

  const onFocus = useCallback((ev) => {
    updateLoop.start();
    setFocusState(true);

    const value = ev.target.value;

    if (mask && !maskUtils.isValueFilled(value)) {
      const newValue = maskUtils.formatValue(value);
      const newSelection = maskUtils.getDefaultSelectionForValue(newValue);
      const newInputState = {
        value: newValue,
        selection: newSelection,
      };

      setInputState(newInputState);

      if (newValue !== value && props.onChange) {
        props.onChange(newValue, ev);
      }

      // Chrome resets selection after focus event,
      // so we want to restore it later
      defer(() => {
        setInputState(newInputState);
      });
    }

    if (props.onFocus) props.onFocus(ev);
  }, [ maskUtils, defer, setInputState, getValueState ]);

  const onBlur = useCallback((ev) => {
    updateLoop.stop();
    setFocusState(false);

    const value = ev.target.value;
    const lastValue = getValueState();

    if (!!mask && !alwaysShowMask && maskUtils.isValueEmpty(lastValue)) {
      const newValue = "";
      const newInputState = {
        value: newValue,
        selection: { start: null, end: null },
      };

      setInputState(newInputState);

      if (newValue !== value && props.onChange) {
        props.onChange(newValue, ev);
      }
    }

    if (props.onBlur) props.onBlur(ev);
  }, [ maskUtils, setInputState, getValueState, setFocusState ]);

  // Tiny unintentional mouse movements can break cursor
  // position on focus, so we have to restore it in that case
  const onMouseDown = useCallback((ev) => {
    const focused = getFocusState();
    const value = ev.target.value;

    if (!focused && !maskUtils.isValueFilled(value)) {
      const mouseDownX = ev.clientX;
      const mouseDownY = ev.clientY;
      const mouseDownTime = new Date().getTime();

      const inputDocument = ev.target.ownerDocument;
      const mouseUpHandler = (ev2) => {
        inputDocument.removeEventListener("mouseup", mouseUpHandler);

        if (!focused) return;

        const deltaX = Math.abs(ev2.clientX - mouseDownX);
        const deltaY = Math.abs(ev2.clientY - mouseDownY);
        const axisDelta = Math.max(deltaX, deltaY);
        const timeDelta = new Date().getTime() - mouseDownTime;

        if (
          (axisDelta <= 10 && timeDelta <= 200) ||
          (axisDelta <= 5 && timeDelta <= 300)
        ) {
          const lastValue = getValueState();
          const newSelection = maskUtils.getDefaultSelectionForValue(lastValue);

          const newState = {
            value: lastValue,
            selection: newSelection,
          };

          setInputState(newState);
        }
      };

      inputDocument.addEventListener("mouseup", mouseUpHandler);
    }

    if (props.onMouseDown) props.onMouseDown(ev);
  }, [ getFocusState ]);

  const previousFocused = usePrevious(focusedAtRender);
  const previouslyMasked = usePrevious(!!mask);
  useLayoutEffect(() => {
    if (!mask) return;

    const isFocused = getFocusState();
    const previousSelection = getSelectionState();
    const currentState = { value: ref.current.value, selection: getInputSelection(ref.current) };
    const newInputState = { ...currentState };

    // Update value for uncontrolled inputs to make sure
    // it's always in sync with mask props

    const currentValue = currentState.value;
    const formattedValue = maskUtils.formatValue(currentValue);
    const isValueEmpty = maskUtils.isValueEmpty(formattedValue);
    const shouldFormatValue = !isValueEmpty || isFocused || alwaysShowMask;
    if (shouldFormatValue) {
      newInputState.value = formattedValue;
    } else if (isValueEmpty && !isFocused) {
      newInputState.value = "";
    }


    if ((isFocused && !previouslyMasked) || !previousFocused && maskUtils.isValueEmpty(newInputState.value)) {
      // Adjust selection if input got masked while being focused
      newInputState.selection = maskUtils.getDefaultSelectionForValue(newInputState.value);
    } else if (isFocused && previousSelection) {
      // Restore cursor position if value has changed outside change event
      if (previousSelection.start !== null && previousSelection.end !== null) {
        newInputState.selection = previousSelection;
      }
    }

    setInputState(newInputState);
  });

  return (
    <Component
      {...props}
      value={getValueState() || ''}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      onMouseDown={onMouseDown}
    />
  );
});
MaskedInput.displayName = 'MaskedInput';
MaskedInput.propTypes = propTypes;
MaskedInput.defaultProps = defaultProps;

export default MaskedInput;

export function getInputSelection (input) {
  if (!input) return { start: null, end: null, length: 0 };
  const start = input.selectionStart;
  const end = input.selectionEnd;

  return {
    start,
    end,
    length: end - start,
  };
}

export function setInputSelection (input, { start, end = start }) {
  input.setSelectionRange(start, end);
}
