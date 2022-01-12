// import { cl as classNames } from 'common/utils';
import PropTypes from 'common/prop-types';
import { forwardRef, useCallback } from 'react';
import Control from 'common/ui/control';
import useInputContext from 'common/ui/useInputContext';
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
     * The underlying HTML element to use when rendering the Input.
     *
     * @type {('input'|'textarea'|'select'|elementType)}
     */
  as: PropTypes.elementType,

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
  onEnterKey: PropTypes.func,

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

const TextField = forwardRef(({
  type,
  id,
  readOnly,
  value = '',
  onChange,
  onEnterKey,
  onKeyDown,
  focusKey,
  as = 'input',
  disabled,
  ...props
}, ref) => {
  const { controlId, disabled: contextDisabled } = useInputContext();
  const { ref: focusRef } = useFocus(focusKey, true);
  ref = useMergedRefs(ref, focusRef);

  const handleChange = useCallback((ev) => {
    if (onChange) onChange(ev.target.value);
  }, [ onChange ]);

  const handleKeyDown = useCallback((ev) => {
    onKeyDown && onKeyDown(ev);
    if (ev.defaultPrevented) return;
    if (ev.key === 'Enter' && onEnterKey) onEnterKey(ev);
  }, [ onKeyDown, onEnterKey ]);

  return (
    <Control
      {...props}
      as={as}
      value={value || value === 0 ? String(value) : ''}
      type={type}
      ref={ref}
      readOnly={readOnly}
      id={id || controlId}
      disabled={disabled || contextDisabled}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />);
});
TextField.displayName = 'TextField';
TextField.propTypes = propTypes;

export default TextField;
