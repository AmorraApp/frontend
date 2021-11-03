import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './navbar.scss';

const propTypes = {
  /**
     * An href, when provided the Brand will render as an `<a>` element (unless `as` is provided).
     */
  href: PropTypes.string,

  /**
     * Set a custom element for this component.
     */
  as: PropTypes.elementType,
};

const NavbarBrand = forwardRef(({ className, as, ...props }, ref) => {
  const Component = as || (props.href ? 'a' : 'span');
  return (
    <Component {...props} ref={ref} className={classNames(className, styles['navbar-brand'])} />
  );
});
NavbarBrand.displayName = 'NavbarBrand';
NavbarBrand.propTypes = propTypes;

export default NavbarBrand;
