
import divWithClassName from '../divWithClassName';
import * as styles from './popover.scss';
import Popover from './Popover';
import PopoverContent from './PopoverContent';
import PopoverInline from './PopoverInline';
import OverlayTrigger from 'common/ui/overlay/OverlayTrigger';
import DropdownItem from 'common/ui/dropdown/DropdownItem';

export const PopoverTitle = divWithClassName(styles['popover-header'], 'PopoverTitle');
export const PopoverDivider = divWithClassName(styles['popover-divider'], 'PopoverDivider');
export const PopoverMenu = divWithClassName(styles['popover-menu'], 'PopoverMenu');

Popover.Inline = PopoverInline;
Popover.Title = PopoverTitle;
Popover.Content = PopoverContent;
Popover.Menu = PopoverMenu;
Popover.Item = DropdownItem;
Popover.Divider = PopoverDivider;
Popover.Trigger = OverlayTrigger;
export default Popover;
