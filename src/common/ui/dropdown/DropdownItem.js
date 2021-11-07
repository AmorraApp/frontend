import { cl as classNames, isUndefinedOrNull } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useContext, useCallback } from 'react';
import useEventCallback from 'common/hooks/useEventCallback';

import useSelectableContext from 'common/selectable-context';
import NavContext from '../nav/NavContext';
import SafeAnchor from '../safe-anchor';

import styles from './dropdown.scss';

const propTypes = {
  /**
     * Highlight the menu item as active.
     */
  active: PropTypes.bool,

  /**
     * Prevent hover highlight.
     */
  inactive: PropTypes.bool,

  /**
     * Disable the menu item, making it unselectable.
     */
  disabled: PropTypes.bool,
  /**
     * Value passed to the `onSelect` handler, useful for identifying the selected menu item.
     */
  eventKey: PropTypes.any,
  /**
     * HTML `href` attribute corresponding to `a.href`.
     */
  href: PropTypes.string,
  /**
     * Callback fired when the menu item is clicked.
     */
  onClick: PropTypes.func,
  /**
     * Callback fired when the menu item is selected.
     *
     * ```js
     * (eventKey: any, event: Object) => any
     * ```
     */
  onSelect: PropTypes.func,

  onHover: PropTypes.func,

  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,

  as: PropTypes.elementType,
};
const defaultProps = {
  as: SafeAnchor,
  disabled: false,
};

const DropdownItem = forwardRef(({
  className,
  children,
  eventKey,
  disabled,
  href,
  onClick,
  onSelect,
  onHover,
  onMouseEnter,
  onMouseLeave,
  active,
  inactive,
  as: Component,
  ...props
}, ref) => {
  const { activeKey: activeSelectKey, onSelect: onSelectCtx } = useSelectableContext();
  const activeNavKey = useContext(NavContext);

  // TODO: Restrict eventKey to string in v5?
  const key = eventKey || href;

  if (isUndefinedOrNull(active)) {
    if (!isUndefinedOrNull(activeSelectKey)) active = activeSelectKey === key;
    else if (!isUndefinedOrNull(activeNavKey)) active = activeNavKey === key;
  }

  const handleClick = useEventCallback((event) => {
    // SafeAnchor handles the disabled case, but we handle it here
    // for other components
    if (disabled) { return; }
    if (onClick) { onClick(event); }
    if (onSelectCtx) { onSelectCtx(key, event); }
    if (onSelect) { onSelect(key, event); }
  });

  const handleMouseEnter = useCallback((ev) => {
    onMouseEnter && onMouseEnter(ev);
    if (ev.defaultPrevented) return;
    onHover && onHover(eventKey, ev);
  }, [ eventKey, onHover ]);

  const handleMouseLeave = useCallback((ev) => {
    onMouseLeave && onMouseLeave(ev);
    if (ev.defaultPrevented) return;
    onHover && onHover(null, ev);
  }, [ onHover ]);

  return (
    <Component
      {...props}
      ref={ref}
      href={href}
      disabled={disabled}
      className={classNames(
        className,
        styles['dropdown-item'],
        active && styles.active,
        inactive && styles.inactive,
        disabled && styles.disabled,
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>);
});
DropdownItem.displayName = 'DropdownItem';
DropdownItem.propTypes = propTypes;
DropdownItem.defaultProps = defaultProps;
export default DropdownItem;
