import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { useUncontrolled } from 'uncontrollable';

import styles from './nav.scss';
export { styles as Classes };

import AbstractNav from './AbstractNav';
import NavLink from './NavLink';
import NavItem from './NavItem';

export { NavLink, NavItem };

const propTypes = {

  /**
     * The visual variant of the nav items.
     *
     * @type {('tabs'|'pills')}
     */
  variant: PropTypes.string,

  /**
     * Marks the NavItem with a matching `eventKey` (or `href` if present) as active.
     *
     * @type {string}
     */
  activeKey: PropTypes.any,

  /**
     * Have all `NavItem`s proportionately fill all available width.
     */
  fill: PropTypes.bool,

  /**
     * Have all `NavItem`s evenly fill all available width.
     *
     * @type {boolean}
     */
  justify: PropTypes.bool,

  /**
     * A callback fired when a NavItem is selected.
     *
     * ```js
     * function (
     *  Any eventKey,
     *  SyntheticEvent event?
     * )
     * ```
     */
  onSelect: PropTypes.func,

  /**
     * ARIA role for the Nav, in the context of a TabContainer, the default will
     * be set to "tablist", but can be overridden by the Nav when set explicitly.
     *
     * When the role is "tablist", NavLink focus is managed according to
     * the ARIA authoring practices for tabs:
     * https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#tabpanel
     */
  role: PropTypes.string,

  /**
     * Apply styling an alignment for use in a Navbar. This prop will be set
     * automatically when the Nav is used inside a Navbar.
     */
  navbar: PropTypes.bool,
  as: PropTypes.elementType,
};

const defaultProps = {
  justify: false,
  fill: false,
};

const Nav = forwardRef((uncontrolledProps, ref) => {
  const {
    as = 'div',
    variant,
    fill,
    justify,
    className,
    children,
    activeKey,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    activeKey: 'onSelect',
  });

  return (
    <AbstractNav
      as={as}
      ref={ref}
      activeKey={activeKey}
      className={classNames(
        className,
        styles.nav,
        variant && styles[`nav-${variant}`],
        fill && styles['nav-fill'],
        justify && styles['nav-justified'],
      )}
      {...props}
    >{children}</AbstractNav>);
});
Nav.displayName = 'Nav';
Nav.propTypes = propTypes;
Nav.defaultProps = defaultProps;
Nav.Item = NavItem;
Nav.Link = NavLink;
export default Nav;
