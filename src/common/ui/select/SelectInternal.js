import { cl as classNames, sort } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect, useRef, Fragment, useMemo } from 'react';
import styles from './select.scss';
import useSelectContext from './useSelectContext';
import useDerivedState from 'common/hooks/useDerivedState';
import useSilentState from 'common/hooks/useSilentState';
import useMergedRefs from 'common/hooks/useMergedRefs';
import SelectCaption from './SelectCaption';
import SelectNative from './SelectNative';
import ChevronDown from 'common/svgs/solid/chevron-down.svg';
import FormControl from 'common/ui/control';
import { DropdownMenu, DropdownItem, DropdownHeader, useDropdownContext } from 'common/ui/dropdown';
import CloseButton from 'common/ui/close-button';
import Check from 'common/svgs/regular/check-circle.svg';
import useFocus from 'common/ui/focus';
import { BodyMount } from 'common/ui/mount';

const propTypes = {
  selectProps: PropTypes.object,
  controlProps: PropTypes.object,
  inputProps: PropTypes.object,
};

const getNodeText = (node) => {
  if ([ 'string', 'number' ].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getNodeText).join('');
  if (typeof node === 'object' && node) return getNodeText(node.props.children);
};

function testOption (option, target, value) {
  if (!value) return;
  if (value === target) {
    option.width += 6;
  } else if (value.startsWith(target)) {
    option.weight += 3;
  } else if (value.includes(target)) {
    option.weight += 1;
  }
}

const SelectInternal = forwardRef(({
  selectProps,
  controlProps,
  inputProps: { onInputChange, ...inputProps } = {},
}, ref) => {


  const {
    className,
    multiple,
    combobox,
    clearable,
    toggleProps: { ref: togglePropsRef, ...toggleProps },
    show,
    toggleMenu,
    options: optionsRaw,
    selection,
    onBlur,
    disabled,
    drop,
    align,
    focusKey,
  } = useSelectContext();

  var { onKeyDown } = inputProps;

  var { parentRef } = useDropdownContext();

  var controlRef = useRef();
  var { ref: focusRef } = useFocus(focusKey, true);
  var mergedRef = useMergedRefs(togglePropsRef, controlRef, focusRef, ref);

  var [ activeRow, setActiveRow, getActiveRow ] = useDerivedState(() => null, [ show ]);

  var [ inputText, setInputText, getInputText ] = useDerivedState(() => '', [ show ]);
  var inputRef = useRef();

  var handleInputChange = useCallback((text, ev) => {
    onInputChange && onInputChange(text, ev);
    if (!text) controlRef.current?.focus();
    setInputText(text);
    setActiveRow(null);
    if (!show && text) toggleMenu(true);
  }, [ inputRef, setInputText ]);

  var handleInputKey = useCallback((ev) => {
    switch (ev.key) {
    case 'ArrowUp':
    case 'ArrowDown':
    case 'Enter':
    case 'Return':
      return handleKeyDown(ev);
    default:
      onKeyDown && onKeyDown(ev);
    }
  }, [ handleKeyDown, onKeyDown ]);

  var options = useMemo(() => optionsRaw.filter((option) => {
    const { label, value, caption } = option;
    option.weight = 0;
    if (!inputText || (combobox && !multiple)) {
      option.weight = 1;
      return true; // we don't filter on solo combobox because they need to see all options
    }

    const target = inputText.toUpperCase();
    testOption(option, target, label && String(label).toUpperCase());
    testOption(option, target, value && String(value).toUpperCase());
    testOption(option, target, caption && getNodeText(caption).toUpperCase());
    return !!option.weight;
  }), [ inputText, optionsRaw ]);

  useEffect(() => {
    if (getActiveRow()) return;
    const weightSorted = sort(options, 'weight');
    setActiveRow(weightSorted[ weightSorted.length - 1]);
  }, [ options ]);

  var handleMenuHover = useCallback((option) => {
    if (!option) return;
    setActiveRow(option);
  });

  var handleKeyDown = useCallback((ev) => {
    onKeyDown && onKeyDown(ev);
    if (ev.defaultPrevented) return;

    const currentActive = getActiveRow();

    const { key } = ev;
    switch (key) {
    case 'ArrowUp': {
      ev.preventDefault();
      let optionIndex = currentActive ? options.indexOf(currentActive) : -1;
      optionIndex = optionIndex <= 0 ? optionIndex = options.length - 1 : optionIndex - 1;
      setActiveRow(options[optionIndex]);
      if (!show) toggleMenu(true);
      return;
    }
    case 'ArrowDown': {
      ev.preventDefault();
      let optionIndex = currentActive ? options.indexOf(currentActive) : options.length;
      optionIndex = optionIndex >= options.length - 1 ? optionIndex = 0 : optionIndex + 1;
      setActiveRow(options[optionIndex]);
      if (!show) toggleMenu(true);
      return;
    }
    case 'Escape':
    case 'Tab':
      if (key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
      }
      toggleMenu(false);
      break;
    case 'Enter':
    case 'Return':
    case 'Space':
      if (!currentActive) return;
      selection.select(currentActive);
      setInputText('');
      if (!multiple) toggleMenu(false);
      break;
    case 'Backspace':
    case 'Delete':
      selection.clear();
      if (!multiple) toggleMenu(false);
      break;
    default:
      if (key.length === 1 && !ev.controlKey && !ev.metaKey && !ev.altKey) {
        if (!show) toggleMenu(true);
        onInputChange && onInputChange(key, ev);
        setInputText(key);
        ev.preventDefault();
        ev.stopPropagation();
        inputRef.current?.focus();
        if (combobox && !multiple) selection.select(key);
      }
    }
  }, [ getActiveRow, onKeyDown, selection, toggleMenu, options ]);

  const handleMenuSelect = useCallback((option) => {
    selection.toggle(option);

    if (combobox && !multiple) setInputText(option.value);
    else setInputText('');

    if (!multiple) toggleMenu(false);
    if (getInputText() || (combobox && !multiple)) {
      inputRef.current?.focus();
    } else {
      controlRef.current?.focus();
    }
  }, [ selection, toggleMenu ]);

  const handleClick = useCallback((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (disabled) return;
    toggleMenu(!show, ev);
  }, [ show, toggleMenu, disabled ]);

  const [ , setMouseDown, getMouseDown ] = useSilentState(false);
  const menuMouseDown = useCallback(() => {
    if (disabled) return;
    setMouseDown(true);
  }, [ setMouseDown, disabled ]);

  const menuMouseUp = useCallback(() => {
    setMouseDown(false);
  }, [ setMouseDown ]);

  const handleClear = useCallback((ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    selection.clear();
    setInputText('');
  }, [ selection ]);

  const handleBlur = useCallback((ev) => {
    const baseElement = parentRef.current;
    if (baseElement && baseElement.contains(ev.relatedTarget)) {
      baseElement.focus();
    } else if (!getMouseDown()) {
      toggleMenu(false);
    }
    onBlur && onBlur(ev);
  }, [ onBlur, getMouseDown, parentRef, toggleMenu ]);

  const classes = classNames(
    className,
    styles['select-internal'],
    styles['form-control'],
    multiple ? styles['select-multiple'] : styles['select-single'],
  );

  let previousGroup;
  return (
    <>
      <FormControl
        {...controlProps}
        {...toggleProps}
        focusable={!disabled}
        ref={mergedRef}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
      >
        <SelectNative selectProps={selectProps} />
        <SelectCaption ref={inputRef} onInputChange={handleInputChange} inputValue={inputText} {...inputProps} onKeyDown={handleInputKey} />
        {clearable && !selection.empty && (
          <CloseButton className={styles.clear} onClick={handleClear} tabIndex={-1} disabled={disabled} />
        )}
        <span className={styles.chevron}><ChevronDown /></span>
      </FormControl>
      <BodyMount source="select">
        <DropdownMenu
          drop={drop}
          align={align}
          renderOnMount
          rootCloseInclusions={[ controlRef ]}
          onMouseDown={menuMouseDown}
          onMouseUp={menuMouseUp}
          className={styles.menu}
        >
          {options.map((option) => (
            <Fragment key={option.value}>
              {option.group !== previousGroup && <div className={styles['group-footer']} />}
              {option.group !== previousGroup && (previousGroup = option.group) && <DropdownHeader className={styles['group-header']}><span>{option.group}</span></DropdownHeader>}
              <DropdownItem
                key={option.value}
                as="div" /* This ensures DropdownItem doesn't use SafeAnchor, which makes each menu item keyboard focusable */
                eventKey={option}
                title={option.label}
                active={activeRow === option}
                inactive={activeRow !== option}
                onHover={handleMenuHover}
                onSelect={handleMenuSelect}
                className={styles['menu-item']}
              >
                {option.caption ?? option.label ?? option.value}
                {selection.includes(option) && <i className={styles.check}><Check /></i>}
              </DropdownItem>
            </Fragment>
          ))}
        </DropdownMenu>
      </BodyMount>
    </>
  );

});
SelectInternal.displayName = 'SelectInternal';
SelectInternal.propTypes = propTypes;
export default SelectInternal;

