
import { cl as classNames } from 'common/utils';
import { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as styles from './sidenav.scss';
import { mapChildren } from '../../children';
import useSideNavContext from './SideNavContext';

const propTypes = {
  /** @default 'ul' */
  as: PropTypes.elementType,
};

function getAvailableKeys (children) {
  return mapChildren(children, (child) => {
    if (child.type.displayName !== 'SideNavItem') return null;
    const keys = child.props.children ? getAvailableKeys(child.props.children) : [];
    return [ child.props.eventKey, ...keys ];
  }).flat(Infinity).filter(Boolean);
}

const SideNav = forwardRef(({
  as: Nav = 'ul',
  className,
  children,
  ...props
}, ref) => {

  const { activeKey, switchTo } = useSideNavContext();

  const availableKeys = getAvailableKeys(children);

  useEffect(() => {
    if (availableKeys.includes(activeKey)) return;
    if (activeKey) {
      console.warn(`SideNavContext#activeKey is "${activeKey}", but there are no SideNavItems with this key.`); // eslint-disable-line
    }
    switchTo(availableKeys[0]);
  }, [ activeKey ]);

  return (
    <aside className={styles['sidenav-aside']}>
      <Nav
        as={'ul'}
        ref={ref}
        className={classNames(
          className,
          styles.sidenav,
        )}
        {...props}
      >{children}</Nav>
    </aside>
  );
});
SideNav.displayName = 'SideNav';
SideNav.propTypes = propTypes;

export default SideNav;
