import { cl as classNames, isUndefinedOrNull, noop } from 'common/utils';
import PropTypes from 'common/prop-types';
import { forwardRef, useContext, useRef } from 'react';
import useMergedRefs from 'common/hooks/useMergedRefs';

import useDropdownContext from './useDropdownContext';
import NavbarContext from '../navbar/NavbarContext';
import usePopper from 'common/hooks/usePopper';
import useRootClose from '../useRootClose';
import usePopperMarginModifiers from '../usePopperMarginModifiers';

import styles from './dropdown.scss';

const alignDirection = PropTypes.oneOf([ 'start', 'center', 'end' ]);

export const alignPropType = PropTypes.oneOfType([
  alignDirection,
  PropTypes.shape({ sm: alignDirection }),
  PropTypes.shape({ md: alignDirection }),
  PropTypes.shape({ lg: alignDirection }),
  PropTypes.shape({ xl: alignDirection }),
]);

const propTypes = {

  className: PropTypes.string,
  style: PropTypes.object,

  /** Controls the visibility of the Dropdown menu  */
  show: PropTypes.bool,

  /**
   * Determines the direction and location of the Menu in relation to it's Toggle.
   */
  drop: PropTypes.oneOf([ 'up', 'left', 'right', 'down', 'top', 'bottom' ]),

  /** Whether to render the dropdown menu in the DOM before the first time it is shown */
  renderOnMount: PropTypes.bool,

  /** Have the dropdown switch to it's opposite placement when necessary to stay on screen. */
  flip: PropTypes.bool,

  /**
   * Aligns the dropdown menu to the specified side of the container. You can also align
   * the menu responsively for breakpoints starting at `sm` and up. The alignment
   * direction will affect the specified breakpoint or larger.
   *
   * *Note: Using responsive alignment will disable Popper usage for positioning.*
   *
   * @type {"left"|"right"|{ sm: "left"|"right" }|{ md: "left"|"right" }|{ lg: "left"|"right" }|{ xl: "left"|"right"} }
   */
  align: alignPropType,

  onSelect: PropTypes.func,

  /**
   * Which event when fired outside the component will cause it to be closed
   *
   * *Note: For custom dropdown components, you will have to pass the
   * `rootCloseEvent` to `<RootCloseWrapper>` in your custom dropdown menu
   * component ([similarly to how it is implemented in `<Dropdown.Menu>`](https://github.com/react-bootstrap/react-bootstrap/blob/v0.31.5/src/DropdownMenu.js#L115-L119)).*
   */
  rootCloseEvent: PropTypes.oneOf([ 'click', 'mousedown' ]),

  /**
   * Refs to elements beyond the menu that should be ignored for root closure
   */
  rootCloseInclusions: PropTypes.oneOfType([
    PropTypes.ref,
    PropTypes.arrayOf(PropTypes.ref),
  ]),

  /**
   * Control the rendering of the DropdownMenu. All non-menu props
   * (listed here) are passed through to the `as` Component.
   *
   * If providing a custom, non DOM, component. the `show` and `close` props
   * are also injected and should be handled appropriately.
   */
  as: PropTypes.elementType,
};
const defaultProps = {
  flip: true,
  renderOnMount: true,
};

const DropdownMenu = forwardRef(({
  className,
  align,
  rootCloseEvent,
  rootCloseInclusions,
  flip,
  show,
  drop,
  renderOnMount,
  as: Component = 'div',
  ...props
}, ref) => {
  const isNavbar = useContext(NavbarContext);
  const context = useDropdownContext();
  const { toggle = noop, setMenu } = context || {};
  const menuElement = context.getMenu();
  const toggleElement = context.getToggle();

  if (isUndefinedOrNull(show)) show = context?.show;
  if (isUndefinedOrNull(flip)) flip = context?.flip;
  if (isUndefinedOrNull(drop)) drop = context?.drop || 'bottom';
  if (isUndefinedOrNull(align)) align = context?.align || 'center';

  const hasShownRef = useRef(false);
  if (show && !hasShownRef.current) hasShownRef.current = true;
  const hasShown = hasShownRef.current;

  let placement = drop;
  if (typeof align === 'string' && align !== 'center') {
    placement = `${drop}-${align}`;
  }

  const [ popperRef, marginModifiers ] = usePopperMarginModifiers();
  const alignClasses = [];
  if (typeof align === 'object') {
    const keys = Object.keys(align);

    if (keys.length) {
      const brkPoint = keys[0];
      const direction = align[brkPoint];
      // .dropdown-menu-right is required for responsively aligning
      // left in addition to align left classes.
      alignClasses.push(styles[`dropdown-menu-${brkPoint}-${direction}`]);
    }
  }

  const shouldUsePopper = context || !isNavbar && alignClasses.length === 0;
  let popper = usePopper(toggleElement, menuElement, {
    placement,
    enabled: !!(shouldUsePopper && show),
    modifiers: [
      {
        name: 'eventListeners',
        enabled: show,
      },
      {
        name: 'flip',
        enabled: !!flip,
      },
      ...marginModifiers,
    ],
  });
  if (!shouldUsePopper) popper = null;
  // we have to invoke the hook every time,
  // but if it's not being used then we should release it for GC

  const menuProps = {
    ref: useMergedRefs(popperRef, ref, setMenu),
    'aria-labelledby': toggleElement?.id,
    ...popper?.attributes.popper,
    style: popper?.styles.popper,
  };

  if (!Array.isArray(rootCloseInclusions)) {
    rootCloseInclusions = rootCloseInclusions && [ rootCloseInclusions ] || [];
  }

  useRootClose([ menuElement, ...rootCloseInclusions ], (e) => toggle(false, e), {
    clickTrigger: rootCloseEvent,
    disabled: !show,
  });


  if (!hasShown && !renderOnMount) { return null; }

  // For custom components provide additional, non-DOM, props;
  if (typeof Component !== 'string') {
    menuProps.show = show;
    menuProps.close = () => toggle(false);
  }

  let style = props.style;

  if (placement) {
    // we don't need the default popper style,
    // menus are display: none when not shown.
    style = { ...props.style, ...menuProps.style };
    props['x-placement'] = placement;
  }

  return (
    <Component
      {...props}
      {...menuProps}
      style={style}
      className={classNames(
        className,
        styles['dropdown-menu'],
        show && styles.show,
        align === 'end' && styles['dropdown-menu-right'],
        ...alignClasses,
      )}
    />);
});
DropdownMenu.displayName = 'DropdownMenu';
DropdownMenu.propTypes = propTypes;
DropdownMenu.defaultProps = defaultProps;
export default DropdownMenu;
