import PropTypes from 'prop-types';
import { forwardRef, cloneElement, useMemo } from 'react';
import { useUncontrolled } from 'uncontrollable';
import chainFunction from 'common/ui/createChainedFunction';
import { map as mapChildren } from 'common/children';
import ButtonGroup from 'common/ui/button/ButtonGroup';
import ToggleButton from './ToggleButton';
import useInputContext from '../useInputContext';
import { v4 as uuid } from 'uuid';

const propTypes = {
  /**
     * An HTML `<input>` name for each child button.
     *
     * If none is provided, one will be generated.
     */
  name: PropTypes.string,

  /**
     * The value, or array of values, of the active (pressed) buttons
     *
     * @controllable onChange
     */
  value: PropTypes.any,

  /**
     * Callback fired when a button is pressed, depending on whether the `type`
     * is `'radio'` or `'checkbox'`, `onChange` will be called with the value or
     * array of active values
     *
     * @controllable value
     */
  onChange: PropTypes.func,

  /**
     * The input `type` of the rendered buttons, determines the toggle behavior
     * of the buttons
     */
  type: PropTypes.oneOf([ 'checkbox', 'radio' ]),

  /**
     * Sets the size for all Buttons in the group.
     *
     * @type ('sm'|'lg')
     */
  size: PropTypes.string,

  /** Make the set of Buttons appear vertically stacked. */
  vertical: PropTypes.bool,

  /*
    Variant to use for active buttons
   */
  activeVariant: PropTypes.oneOf([
    'input', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link',
    'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-dark', 'outline-light',
  ]),

  /*
    Variant to use for inactive buttons
   */
  inactiveVariant: PropTypes.oneOf([
    'input', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link',
    'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-dark', 'outline-light',
  ]),

  disabled: PropTypes.bool,
};

const defaultProps = {
  activeVariant: 'primary',
  inactiveVariant: 'input',
  type: 'radio',
  vertical: false,
};

const ToggleButtonGroup = forwardRef((props, ref) => {
  const {
    children,
    type,
    name,
    value,
    onChange,
    activeVariant,
    inactiveVariant,
    disabled,
    ...controlledProps
  } = useUncontrolled(props, {
    value: 'onChange',
  });

  const previousContext = useInputContext();
  const id = useMemo(() => name || previousContext?.controlId || uuid().replace(/[^a-zA-Z0-9]/g, '').substr(-8), [ name, previousContext.controlid ]);

  const getValues = () => (value ? [].concat(value) : []);

  const handleToggle = (inputVal, event) => {
    if (!onChange) {
      return;
    }
    const values = getValues();
    const isActive = values.indexOf(inputVal) !== -1;
    if (type === 'radio') {
      if (!isActive && onChange) { onChange(inputVal, event); }
      return;
    }
    if (isActive) {
      onChange(values.filter((n) => n !== inputVal), event);
    } else {
      onChange([ ...values, inputVal ], event);
    }
  };

  return (
    <ButtonGroup {...controlledProps} ref={ref} toggle>
      {mapChildren(children, (child) => {
        const values = getValues();
        const { value: childVal, onChange: childOnChange } = child.props;
        const handler = (e) => handleToggle(childVal, e);
        const checked = values.indexOf(childVal) !== -1;
        const variant = child.props.variant || (checked ? activeVariant : inactiveVariant);
        return cloneElement(child, {
          type: child.props.type || type,
          name: child.props.name || id,
          checked,
          variant,
          onChange: chainFunction(childOnChange, handler),
          disabled: disabled || child.props.disabled,
        });
      })}
    </ButtonGroup>
  );
});
ToggleButtonGroup.displayName = 'ToggleButtonGroup';
ToggleButtonGroup.propTypes = propTypes;
ToggleButtonGroup.defaultProps = defaultProps;
ToggleButtonGroup.Button = ToggleButton;
export default ToggleButtonGroup;
