import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useEffect } from 'react';
import { usePrevious } from 'common/hooks';
import styles from './select.scss';
import SelectBadge from './SelectBadge';
import useSelectContext from './useSelectContext';

const propTypes = {
  onKeyDown: PropTypes.func,
  onInputChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string,
};

const SelectCaption = forwardRef(({
  onInputChange,
  inputValue,
  onKeyDown,
  ...props
}, ref) => {

  const { selection, multiple, combobox, placeholder, show } = useSelectContext();
  const { values } = selection;

  const inputIsVisible = inputValue || (combobox && show && !multiple);
  const inputWasVisible = usePrevious(!inputIsVisible);
  useEffect(() => {
    // If the input visibility just changed, then we need to refocus it after render
    if (!inputIsVisible) return;
    ref.current?.focus();
  }, [ inputIsVisible, inputWasVisible ]);

  const handleInputChange = useCallback((ev) => {
    const { value } = ev.target;
    ev.stopPropagation();
    onInputChange && onInputChange(value, ev);
    if (combobox && !multiple) selection.select(value);
  }, [ combobox, multiple, onInputChange ]);

  const handleKeyDown = useCallback((ev) => {
    onKeyDown && onKeyDown(ev);
    if (ev.defaultPrevented) return;
    ev.stopPropagation(); // this keeps the parent element from receiving the event.

    // switch (ev.key) {
    // case 'Escape':
    //   ev.preventDefault();
    //   onInputChange && onInputChange('', ev);
    //   break;
    // case 'Enter':
    // case 'Return':
    //   ev.preventDefault();
    //   if (multiple) {
    //     selection.select(ev.target.value);
    //     if (onInputChange) onInputChange('', ev);
    //   }
    //   break;
    // default:
    //   // no-default
    // }


  }, [ onKeyDown, onInputChange, multiple, selection ]);

  let output;
  const input = (
    <input
      {...props}
      ref={ref}
      className={classNames(
        styles['select-input'],
        !inputIsVisible && styles['no-input'],
      )}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      value={inputValue}
    />
  );

  if (!values.length) {
    output = <span className={styles['select-placeholder']}>{placeholder || 'Choose...'}</span>;
  } else if (multiple) {
    output = values.map((option) => <SelectBadge key={String(option.value)} option={option} />);
  } else {
    output = <span title={values[0].label}>{values[0].caption || values[0].label || values[0].value}</span>;
  }

  return <span className={styles['select-current']}>{!inputIsVisible && output}{input}</span>;

});
SelectCaption.displayName = 'SelectCaption';
SelectCaption.propTypes = propTypes;
export default SelectCaption;
