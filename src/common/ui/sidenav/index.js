
export { default as SideNav } from './SideNav';
export { default as SideNavContainer } from './SideNavContainer';
export { default as SideNavItem } from './SideNavItem';
export { default as SideNavPane } from './SideNavPane';
export { default as Classes } from './sidenav.scss';

import SideNav from './SideNav';
import SideNavContainer from './SideNavContainer';
import SideNavItem from './SideNavItem';
import SideNavPane from './SideNavPane';

SideNav.Container = SideNavContainer;
SideNav.Item = SideNavItem;
SideNav.Pane = SideNavPane;
export default SideNav;

