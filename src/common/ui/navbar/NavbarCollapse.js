import { forwardRef } from 'react';
import Collapse from '../collapse';

import { getNavbarContext } from './NavbarContext';
import * as styles from './navbar.scss';

const NavbarCollapse = forwardRef(({ children, ...props }, ref) => {
  const { expanded } = getNavbarContext();
  return (
    <Collapse in={!!expanded} {...props}>
      <div ref={ref} className={styles['navbar-collapse']}>{children}</div>
    </Collapse>
  );
});
NavbarCollapse.displayName = 'NavbarCollapse';

export default NavbarCollapse;
