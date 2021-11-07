import { cl as classNames } from 'common/utils';
import { forwardRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
import divWithClassName from '../divWithClassName';
import styles from './navbar.scss';
export { styles as Classes };

import NavbarBrand from './NavbarBrand';
import NavbarCollapse from './NavbarCollapse';
import NavbarToggle from './NavbarToggle';

import NavbarContext from './NavbarContext';
import { SelectableContextProvider } from 'common/selectable-context';

export const NavbarText = divWithClassName('navbar-text', 'NavbarText', { as: 'span' });

const propTypes = {
  /** @default 'navbar' */
  bsPrefix: PropTypes.string,
  /**
     * The general visual variant a the Navbar.
     * Use in combination with the `bg` prop, `background-color` utilities,
     * or your own background styles.
     *
     * @type {('light'|'dark')}
     */
  variant: PropTypes.string,
  /**
     * The breakpoint, below which, the Navbar will collapse.
     * When `true` the Navbar will always be expanded regardless of screen size.
     */
  expand: PropTypes.oneOf([ true, 'sm', 'md', 'lg', 'xl' ]).isRequired,
  /**
     * A convenience prop for adding `bg-*` utility classes since they are so commonly used here.
     * `light` and `dark` are common choices but any `bg-*` class is supported, including any custom ones you might define.
     *
     * Pairs nicely with the `variant` prop.
     */
  bg: PropTypes.string,
  /**
     * Create a fixed navbar along the top or bottom of the screen, that scrolls with the
     * page. A convenience prop for the `fixed-*` positioning classes.
     */
  fixed: PropTypes.oneOf([ 'top', 'bottom' ]),
  /**
     * Position the navbar at the top or bottom of the viewport,
     * but only after scrolling past it. . A convenience prop for the `sticky-*` positioning classes.
     *
     *  __Not supported in <= IE11 and other older browsers without a polyfill__
     */
  sticky: PropTypes.oneOf([ 'top', 'bottom' ]),
  /**
     * Set a custom element for this component.
     */
  as: PropTypes.elementType,
  /**
     * A callback fired when the `<Navbar>` body collapses or expands. Fired when
     * a `<Navbar.Toggle>` is clicked and called with the new `expanded`
     * boolean value.
     *
     * @controllable expanded
     */
  onToggle: PropTypes.func,
  /**
     * A callback fired when a descendant of a child `<Nav>` is selected. Should
     * be used to execute complex closing or other miscellaneous actions desired
     * after selecting a descendant of `<Nav>`. Does nothing if no `<Nav>` or `<Nav>`
     * descendants exist. The callback is called with an eventKey, which is a
     * prop from the selected `<Nav>` descendant, and an event.
     *
     * ```js
     * function (
     *  eventKey: mixed,
     *  event?: SyntheticEvent
     * )
     * ```
     *
     * For basic closing behavior after all `<Nav>` descendant onSelect events in
     * mobile viewports, try using collapseOnSelect.
     *
     * Note: If you are manually closing the navbar using this `OnSelect` prop,
     * ensure that you are setting `expanded` to false and not *toggling* between
     * true and false.
     */
  onSelect: PropTypes.func,
  /**
     * Toggles `expanded` to `false` after the onSelect event of a descendant of a
     * child `<Nav>` fires. Does nothing if no `<Nav>` or `<Nav>` descendants exist.
     *
     * Manually controlling `expanded` via the onSelect callback is recommended instead,
     * for more complex operations that need to be executed after
     * the `select` event of `<Nav>` descendants.
     */
  collapseOnSelect: PropTypes.bool,
  /**
     * Controls the visiblity of the navbar body
     *
     * @controllable onToggle
     */
  expanded: PropTypes.bool,
  /**
     * The ARIA role for the navbar, will default to 'navigation' for
     * Navbars whose `as` is something other than `<nav>`.
     *
     * @default 'navigation'
     */
  role: PropTypes.string,
};

const defaultProps = {
  expand: true,
  variant: 'light',
  collapseOnSelect: false,
};

const Navbar = forwardRef((props, ref) => {
  const {
    expand,
    variant,
    bg,
    fixed,
    sticky,
    className,
    children,
    as: Component = 'nav',
    expanded,
    onToggle,
    onSelect,
    collapseOnSelect,
    ...controlledProps
  } = useUncontrolled(props, {
    expanded: 'onToggle',
  });

  const handleCollapse = useCallback((...args) => {
    if (onSelect) { onSelect(...args); }
    if (collapseOnSelect && expanded) {
      if (onToggle) {
        onToggle(false);
      }
    }
  }, [ onSelect, collapseOnSelect, expanded, onToggle ]);

  // will result in some false positives but that seems better
  // than false negatives. strict `undefined` check allows explicit
  // "nulling" of the role if the user really doesn't want one

  if (controlledProps.role === undefined && Component !== 'nav') {
    controlledProps.role = 'navigation';
  }

  let expandClass = 'navbar-expand';
  if (typeof expand === 'string') { expandClass = `${expandClass}-${expand}`; }

  const navbarContext = useMemo(() => ({
    onToggle: () => onToggle && onToggle(!expanded),
    expanded: !!expanded,
  }), [ expanded, onToggle ]);

  return (
    <NavbarContext.Provider value={navbarContext}>
      <SelectableContextProvider onSelect={handleCollapse}>
        <Component
          ref={ref}
          {...controlledProps}
          className={classNames(
            className,
            styles.navbar,
            expand && styles[expandClass],
            variant && styles[`navbar-${variant}`],
            bg && styles[`bg-${bg}`],
            sticky && styles[`sticky-${sticky}`],
            fixed && styles[`fixed-${fixed}`],
          )}
        >{children}</Component>
      </SelectableContextProvider>
    </NavbarContext.Provider>
  );
});
Navbar.propTypes = propTypes;
Navbar.defaultProps = defaultProps;
Navbar.displayName = 'Navbar';
Navbar.Brand = NavbarBrand;
Navbar.Toggle = NavbarToggle;
Navbar.Collapse = NavbarCollapse;
Navbar.Text = NavbarText;
export default Navbar;
