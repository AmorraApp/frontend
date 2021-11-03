import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import SafeAnchor from '../safe-anchor';
import AbstractNavItem from './AbstractNavItem';
import * as styles from './nav.scss';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
];

const propTypes = {

  /**
   * The visual style of the NavItem
   *
   * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')}
   */
  variant: PropTypes.oneOf(VARIANTS),

  /**
     * The active state of the NavItem item.
     */
  active: PropTypes.bool,
  /**
     * The disabled state of the NavItem item.
     */
  disabled: PropTypes.bool,
  /**
     * The ARIA role for the `NavLink`, In the context of a 'tablist' parent Nav,
     * the role defaults to 'tab'
     * */
  role: PropTypes.string,
  /** The HTML href attribute for the `NavLink` */
  href: PropTypes.string,
  /** A callback fired when the `NavLink` is selected.
     *
     * ```js
     * function (eventKey: any, event: SyntheticEvent) {}
     * ```
     */
  onSelect: PropTypes.func,
  /**
     * Uniquely idenifies the `NavItem` amongst its siblings,
     * used to determine and control the active state of the parent `Nav`
     */
  eventKey: PropTypes.any,
  /** @default 'a' */
  as: PropTypes.elementType,
};

const defaultProps = {
  disabled: false,
  as: SafeAnchor,
};

const NavLink = forwardRef(({ disabled, className, href, eventKey, onSelect, as, variant, ...props }, ref) => (
  <AbstractNavItem
    {...props}
    href={href}
    ref={ref}
    eventKey={eventKey}
    as={as}
    disabled={disabled}
    onSelect={onSelect}
    className={classNames(
      className,
      styles['nav-link'],
      variant && styles['nav-link-' + variant],
      disabled && styles.disabled,
    )}
  />
));
NavLink.displayName = 'NavLink';
NavLink.propTypes = propTypes;
NavLink.defaultProps = defaultProps;
NavLink.VARIANTS = VARIANTS;
export default NavLink;
