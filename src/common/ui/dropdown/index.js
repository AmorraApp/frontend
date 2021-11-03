
export { default as Dropdown } from './Dropdown';
export { default as DropdownItem } from './DropdownItem';
export { default as DropdownMenu } from './DropdownMenu';
export { default as DropdownToggle, useDropdownToggle } from './DropdownToggle';
export { default as useDropdownContext } from './useDropdownContext';

import Dropdown from './Dropdown';
import DropdownItem from './DropdownItem';
import DropdownMenu from './DropdownMenu';
import DropdownToggle, { useDropdownToggle } from './DropdownToggle';
import useDropdownContext from './useDropdownContext';

import * as styles from './dropdown.scss';
export {
  styles as Classes,
};

import divWithClassName from '../divWithClassName';
export const DropdownHeader = divWithClassName(styles['dropdown-header'], 'DropdownHeader', { role: 'heading' });
export const DropdownDivider = divWithClassName(styles['dropdown-divider'], 'DropdownDivider', { role: 'separator' });
export const DropdownItemText = divWithClassName(styles['dropdown-item-text'], 'DropdownItemText', { as: 'span' });


Dropdown.Divider = DropdownDivider;
Dropdown.Header = DropdownHeader;
Dropdown.Item = DropdownItem;
Dropdown.ItemText = DropdownItemText;
Dropdown.Menu = DropdownMenu;
Dropdown.Toggle = DropdownToggle;
Dropdown.useDropdownToggle = useDropdownToggle;
Dropdown.useDropdownContext = useDropdownContext;
export default Dropdown;
