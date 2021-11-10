
import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useState } from 'react';
import styles from './checkbox.scss';
import useDerivedState from 'common/hooks/useDerivedState';
import useStableMemo from 'common/hooks/useStableMemo';
import useInputContext from 'common/ui/useInputContext';
import { v4 as uuid } from 'uuid';
import VARIANTS from 'common/ui/variants';

import IndeterminateFilled from 'common/svgs/solid/minus-square.svg';
import CheckedFilled from 'common/svgs/solid/check-square.svg';

import Indeterminate from 'common/svgs/regular/minus-square.svg';
import Unchecked from 'common/svgs/regular/square.svg';
import Checked from 'common/svgs/regular/check-square.svg';

const propTypes = {
  /**
   * A HTML id attribute, necessary for proper form accessibility.
   * An id is recommended for allowing label clicks to toggle the check control.
   *
   * This is **required** for custom check controls or when `type="switch"` due to
   * how they are rendered.
   */
  id: PropTypes.string,

  name: PropTypes.string,

  /**
   * The underlying HTML element to use when rendering the Checkbox container.
   *
   * @type {('input'|elementType)}
   */
  as: PropTypes.elementType,

  /**
   * Label for the control.
   */
  label: PropTypes.node,

  /**
   * Label position
   */
  labelAlign: PropTypes.oneOf([ 'after', 'before' ]),

  /**
   * The underlying HTML element to use when rendering the Checkbox's label.
   *
   * @type {('input'|elementType)}
   */
  labelAs: PropTypes.elementType,

  value: PropTypes.bool,

  indeterminate: PropTypes.bool,

  disabled: PropTypes.bool,

  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onKeyDown: PropTypes.func,

  tabIndex: PropTypes.number,

  /**
     * The visual style of the badge
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')}
     */
  variant: PropTypes.oneOf(VARIANTS),

  /** Manually style the input as valid */
  isValid: PropTypes.bool,

  /** Manually style the input as invalid */
  isInvalid: PropTypes.bool,
};

const Checkbox = forwardRef(({
  id,
  name,
  as: Component = 'span',
  labelAs: Label = 'label',
  className,
  label,
  labelAlign = 'after',
  value,
  indeterminate,
  disabled,
  onChange,
  onMouseDown,
  onMouseUp,
  onKeyDown,
  tabIndex,
  isValid,
  isInvalid,
  ...props
}, ref) => {
  const { controlId: contextId, disabled: contextDisabled } = useInputContext();
  const controlId = useStableMemo(() => id || contextId || uuid().replace(/[^a-zA-Z0-9]/g, '').substr(-8), [ id, contextId ]);

  const [ active, setActive ] = useState(false);
  const [ checked, setChecked, getChecked ] = useDerivedState(() => !!value, [ value ]);

  if (tabIndex === undefined) tabIndex = 0;

  let Icon;
  if (indeterminate) {
    if (checked) Icon = IndeterminateFilled;
    else Icon = Indeterminate;
  } else if (checked) {
    if (disabled) Icon = Checked;
    else Icon = CheckedFilled;
  } else {
    Icon = Unchecked;
  }

  const toggle = useCallback(() => {
    const newValue = !getChecked();
    setChecked(newValue);
    onChange && onChange(newValue);
  }, [ getChecked, setChecked, onChange ]);

  const handleMouseDown = useCallback((ev) => {
    onMouseDown && onMouseDown(ev);
    if (ev.defaultPrevented) return;
    setActive(true);
  }, [ onMouseDown, setActive ]);

  const handleMouseUp = useCallback((ev) => {
    onMouseUp && onMouseUp(ev);
    if (ev.defaultPrevented) return;
    setActive(false);
    toggle();
  }, [ onMouseUp, setActive, toggle ]);

  const handleKeyDown = useCallback((ev) => {
    onKeyDown && onKeyDown(ev);
    if (ev.defaultPrevented) return;
    const { key } = ev;
    if (key === 'Space' || key === 'Enter') {
      toggle();
    }
  }, [ onKeyDown, toggle ]);

  const handleInputChange = useCallback((ev) => {
    setChecked(ev.target.checked);
    onChange && onChange(ev.target.checked);
  });

  return (
    <Component
      {...props}
      className={classNames(
        className,
        styles.checkbox,
        disabled && styles.disabled,
        indeterminate && styles.indeterminate,
        checked && styles.checked,
        active && styles.active,
        isValid && styles['is-valid'],
        isInvalid && styles['is-invalid'],
      )}
      tabIndex={tabIndex}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      ref={ref}
    >
      {!!label && labelAlign === 'before' && <Label className={styles.label}>{label}</Label>}
      <span className={styles.box}>
        <input
          id={controlId}
          name={name}
          type="checkbox"
          ref={ref}
          checked={value}
          disabled={disabled || contextDisabled}
          onChange={handleInputChange}
          className={styles.input}
        />
        <Icon />
      </span>
      {!!label && labelAlign === 'after' && <Label className={styles.label}>{label}</Label>}
    </Component>
  );
});

Checkbox.propTypes = propTypes;
Checkbox.displayName = 'Checkbox';
export default Checkbox;
