import { cl as classNames } from 'common/utils';
import PropTypes from 'common/prop-types';
import { forwardRef, useCallback } from 'react';
import Feedback from './Feedback';
import useInputContext from './useInputContext';
import * as styles from './input.scss';
import useFocus from 'common/ui/focus';
import useMergedRefs from 'common/hooks/useMergedRefs';

const propTypes = {
  /**
     * Input size variants
     *
     * @type {('sm'|'lg')}
     */
  size: PropTypes.string,
  /**
     * The size attribute of the underlying HTML element.
     * Specifies the visible width in characters if `as` is `'input'`.
     * Specifies the number of visible options if `as` is `'select'`.
     */
  htmlSize: PropTypes.number,
  /**
     * The underlying HTML element to use when rendering the BaseInput.
     *
     * @type {('input'|'textarea'|'select'|elementType)}
     */
  as: PropTypes.elementType,
  /**
     * Render the input as plain text. Generally used along side `readOnly`.
     */
  plaintext: PropTypes.bool,

  borderless: PropTypes.bool,

  /** Make the control readonly */
  readOnly: PropTypes.bool,

  /** Make the control disabled */
  disabled: PropTypes.bool,

  /**
     * The `value` attribute of underlying input
     *
     * @controllable onChange
     * */
  value: PropTypes.string,

  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,

  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onEnterKey: PropTypes.func,

  /**
     * Use Bootstrap's custom form elements to replace the browser defaults
     * @type boolean
     */
  custom: PropTypes.all(PropTypes.bool, ({ as, type, custom }) => (custom === true && type !== 'range' && as !== 'select'
    ? Error('`custom` can only be set to `true` when the input type is `range`, or  `select`')
    : null)),

  /**
     * The HTML input `type`, which is only relevant if `as` is `'input'` (the default).
     */
  type: PropTypes.string,

  /**
     * Uses `controlId` from InputContext if not explicitly specified.
     */
  id: PropTypes.string,

  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,

  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,

  focusKey: PropTypes.any,

};
const BaseInput = forwardRef(({
  type,
  size,
  htmlSize,
  id,
  className,
  isValid = false,
  isInvalid = false,
  plaintext,
  borderless,
  readOnly,
  custom,
  value = '',
  onChange,
  onEnterKey,
  onKeyDown,
  focusKey,
  as: Component = 'input',
  disabled,
  ...props
}, ref) => {
  const { controlId, disabled: contextDisabled } = useInputContext();
  const { ref: focusRef } = useFocus(focusKey, true);
  ref = useMergedRefs(ref, focusRef);

  const prefix = custom
    ? 'custom'
    : 'form-control'
  ;

  let classes;
  if (plaintext) {
    classes = [ styles[`${prefix}-plaintext`] ];
  } else if (type === 'file') {
    classes = [ styles[`${prefix}-file`] ];
  } else if (type === 'range') {
    classes = [ styles[`${prefix}-range`] ];
  } else if (Component === 'select' && custom) {
    classes = [
      styles[`${prefix}-select`],
      size && styles[`${prefix}-select-${size}`],
    ];
  } else {
    classes = [
      styles[prefix],
      size && styles[`${prefix}-${size}`],
    ];
  }

  const handleChange = (ev) => {
    if (onChange) onChange(ev.target.value);
  };


  const handleKeyDown = useCallback((ev) => {
    onKeyDown && onKeyDown(ev);
    if (ev.defaultPrevented) return;
    if (ev.key === 'Enter' && onEnterKey) onEnterKey(ev);
  });

  return (
    <Component
      {...props}
      value={value}
      type={type}
      size={htmlSize}
      ref={ref}
      readOnly={readOnly}
      id={id || controlId}
      disabled={disabled || contextDisabled}
      className={classNames(
        className,
        classes,
        isValid && styles[`is-valid`],
        isInvalid && styles[`is-invalid`],
        borderless && styles[`${prefix}-borderless`],
      )}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />);
});
BaseInput.displayName = 'BaseInput';
BaseInput.propTypes = propTypes;
export default Object.assign(BaseInput, { Feedback });
