import { forwardRef } from 'react';
// import PropTypes from 'prop-types';
import Dropdown from './index';
import DropdownToggle from './DropdownToggle';
import DropdownMenu from './DropdownMenu';

const propTypes = {
  ...Dropdown.propTypes,
  ...DropdownMenu.propTypes,
  ...DropdownToggle.propTypes,
};
/**
 * A convenience component for simple or general use dropdowns. Renders a `Button` toggle and all `children`
 * are passed directly to the default `Dropdown.Menu`.
 *
 * _All unknown props are passed through to the `Dropdown` component._ Only
 * the Button `variant`, and `size` props are passed to the toggle,
 * along with menu related props are passed to the `Dropdown.Menu`
 */
const DropdownButton = forwardRef(({
  title,
  children,
  rootCloseEvent,
  role,
  renderOnMount,
  drop,
  align,
  show,
  showClassName,
  flip,
  activeKey,
  onToggle,
  onSelect,
  focusFirstItemOnShow,
  itemSelector,
  dropdownStyle,
  dropdownClassName,
  ...props
}, ref) => (
  <Dropdown
    ref={ref}
    {...{
      show,
      showClassName,
      flip,
      activeKey,
      onToggle,
      onSelect,
      focusFirstItemOnShow,
      itemSelector,
      style: dropdownStyle,
      className: dropdownClassName,
    }}
  >
    <DropdownToggle {...props}>
      {title}
    </DropdownToggle>
    <DropdownMenu drop={drop} align={align} role={role} renderOnMount={renderOnMount} rootCloseEvent={rootCloseEvent}>
      {children}
    </DropdownMenu>
  </Dropdown>
));
DropdownButton.displayName = 'DropdownButton';
DropdownButton.propTypes = propTypes;
DropdownButton.Item = Dropdown.Item;
DropdownButton.Divider = Dropdown.Divider;

export default DropdownButton;
