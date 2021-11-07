
import { forwardRef, createRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cl, clamp, isUndefinedOrNull, isString } from 'common/utils';
import styles from './input.scss';
import BaseInput from './BaseInput';
import CaretUp from 'common/svgs/solid/caret-up.svg';
import CaretDown from 'common/svgs/solid/caret-down.svg';
import useDerivedState from 'common/hooks/useDerivedState';

const propTypes = {
  /**
   * The `value` attribute of underlying input
   * */
  value: PropTypes.number,

  /**
     * Input size variants
     *
     * @type {('sm'|'lg')}
     */
  size: PropTypes.string,

  /**
   * @example ['onChangePicker', [ [1, null] ]]
   */
  onChange: PropTypes.func,

  /**
   * The minimum number that the NumberPicker value.
   * @example ['prop', ['min', 0]]
   */
  min: PropTypes.number,

  /**
   * The maximum number that the NumberPicker value.
   *
   * @example ['prop', ['max', 0]]
   */
  max: PropTypes.number,

  /**
   * Amount to increase or decrease value when using the spinner buttons.
   *
   * @example ['prop', ['step', 5]]
   */
  step: PropTypes.number,

  /**
   * A format string used to display the number value. Localizer dependent, read [localization](../localization) for more info.
   *
   * @example ['prop', { max: 1, min: -1 , defaultValue: 0.2585, format: "{ style: 'percent' }" }]
   */
  format: PropTypes.string,

  /**
   * Determines how the NumberPicker parses a number from the localized string representation.
   * You can also provide a parser `function` to pair with a custom `format`.
   */
  parse: PropTypes.func,

  tabIndex: PropTypes.any,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onKeyDown: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyUp: PropTypes.func,
  onBlur: PropTypes.func,
  autoFocus: PropTypes.bool,

  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,

};

const NumericField = forwardRef(({
  disabled,
  value = null,
  min,
  max,
  step = 1,
  onChange,
  size,
  onKeyDown,
  onBlur,
  className,
  ...props
}, ref) => {

  const [ inputValue, setInputValue, getInputValue ] = useDerivedState(value, [ value ]);

  if (!ref) ref = createRef();

  const prep = useCallback((input) => clamp(input, min, max, step), [ min, max, step ]);

  const handleChange = useCallback((rawValue) => {
    if (rawValue === null || rawValue === '') {
      setInputValue(null);
      if (onChange && !isUndefinedOrNull(value)) onChange(null);
      return;
    }

    if (isString(rawValue)) rawValue = Number(rawValue.replace(/[^0-9]/g, ''));
    setInputValue(rawValue);

    // if clamping didn't change it, then we can update now
    if (rawValue === prep(rawValue)) {
      onChange && onChange(rawValue);
    }

    return rawValue;
  }, [ value, onChange, setInputValue, getInputValue ]);

  const increment = useCallback(() => handleChange(prep((getInputValue() || 0) + step), [ getInputValue, handleChange ]));
  const decrement = useCallback(() => handleChange(prep((getInputValue() || 0) - step), [ getInputValue, handleChange ]));

  const handleKeyDown = useCallback((ev) => {
    const { key } = ev;

    onKeyDown && onKeyDown(ev);

    if (ev.defaultPrevented) return;

    if (key === 'Enter') {
      ev.preventDefault();
      handleChange(prep(getInputValue()));
    } else if (key === 'End' && isFinite(max)) {
      ev.preventDefault();
      handleChange(max);
    } else if (key === 'Home' && isFinite(min)) {
      ev.preventDefault();
      handleChange(min);
    } else if (key === 'ArrowDown') {
      ev.preventDefault();
      decrement();
    } else if (key === 'ArrowUp') {
      ev.preventDefault();
      increment();
    }
  }, [ onKeyDown, handleChange, increment, decrement, min, max ]);

  const handleButtonFocus = useCallback(() => {
    if (ref.current) ref.current.focus();
  });

  const handleBlur = useCallback((ev) => {
    onBlur && onBlur(ev);
    if (ev.defaultPrevented) return;
    const v = getInputValue();
    const cv = prep(v);
    if (v !== cv) handleChange(cv);
  }, [ handleChange, prep, getInputValue, onBlur ]);

  const invalid = (String(inputValue) !== String(prep(inputValue)));

  const classes = [
    className,
    styles['form-numeric'],
    disabled && styles.disabled,
    size && styles[`form-numeric-${size}`],
  ];

  return (
    <div className={cl(classes)}>
      <BaseInput
        ref={ref}
        disabled={disabled}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        size={size}
        value={isUndefinedOrNull(inputValue) ? '' : String(inputValue)}
        isInvalid={invalid}
        onBlur={handleBlur}
        {...props}
      />

      <button
        type="button"
        disabled={disabled}
        onClick={increment}
        onFocus={handleButtonFocus}
      ><CaretUp /></button>

      <button
        type="button"
        disabled={disabled}
        onClick={decrement}
        onFocus={handleButtonFocus}
      ><CaretDown /></button>

    </div>
  );
});

NumericField.displayName = 'NumericField';
NumericField.propTypes = propTypes;

export default NumericField;
