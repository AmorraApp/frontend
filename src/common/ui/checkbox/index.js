
import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useState } from 'react';
import styles from './checkbox.scss';
import useDerivedState from 'common/hooks/useDerivedState';

import IndeterminateFilled from 'common/svgs/solid/minus-square.svg';
// import UncheckedFilled from 'common/svgs/solid/square.svg';
import CheckedFilled from 'common/svgs/solid/check-square.svg';

import Indeterminate from 'common/svgs/regular/minus-square.svg';
import Unchecked from 'common/svgs/regular/square.svg';
import Checked from 'common/svgs/regular/check-square.svg';


const Checkbox = forwardRef(({
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
  ...props
}, ref) => {

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
      )}
      tabIndex={tabIndex}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      ref={ref}
    >
      {!!label && labelAlign === 'before' && <Label className={styles.label}>{label}</Label>}
      <span className={styles.box}><Icon /></span>
      {!!label && labelAlign === 'after' && <Label className={styles.label}>{label}</Label>}
    </Component>
  );
});

Checkbox.propTypes = {
  as: PropTypes.elementType,
  labelAs: PropTypes.elementType,
  value: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  tabIndex: PropTypes.number,
  label: PropTypes.any,
  labelAlign: PropTypes.oneOf([ 'after', 'before' ]),
};
Checkbox.displayName = 'Checkbox';
export default Checkbox;
