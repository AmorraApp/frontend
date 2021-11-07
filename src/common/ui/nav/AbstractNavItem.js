import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useContext } from 'react';
import useEventCallback from 'common/hooks/useEventCallback';
import styles from './nav.scss';

import NavContext from './NavContext';
import useSelectableContext from 'common/selectable-context';

const propTypes = {
  id: PropTypes.string,
  active: PropTypes.bool,
  activeClass: PropTypes.string,
  role: PropTypes.string,
  href: PropTypes.string,
  tabIndex: PropTypes.string,
  eventKey: PropTypes.any,
  onclick: PropTypes.func,
  as: PropTypes.any,
  onClick: PropTypes.func,
  onSelect: PropTypes.func,
  'aria-controls': PropTypes.string,
};

const defaultProps = {
  disabled: false,
};

const AbstractNavItem = forwardRef(({
  active,
  activeClass,
  className,
  eventKey,
  onSelect,
  onClick,
  as: Component,
  ...props
}, ref) => {
  const navKey = eventKey || props.href;
  const { onSelect: parentOnSelect } = useSelectableContext();
  const navContext = useContext(NavContext);
  let isActive = active;
  if (navContext) {
    if (!props.role && navContext.role === 'tablist') { props.role = 'tab'; }
    const contextControllerId = navContext.getControllerId(navKey);
    const contextControlledId = navContext.getControlledId(navKey);

    props['data-rb-event-key'] = navKey;
    props.id = contextControllerId || props.id;
    props['aria-controls'] = contextControlledId || props['aria-controls'];
    isActive = (!active && !!navKey)
      ? navContext.activeKey === navKey
      : active;
  }

  if (props.role === 'tab') {
    props.tabIndex = isActive ? props.tabIndex : -1;
    props['aria-selected'] = isActive;
  }

  const handleOnclick = useEventCallback((e) => {
    if (onClick) { onClick(e); }
    if (!navKey) { return; }
    if (onSelect) { onSelect(navKey, e); }
    if (parentOnSelect) { parentOnSelect(navKey, e); }
  });

  return (
    <Component {...props} ref={ref} onClick={handleOnclick} className={classNames(className, isActive && [ styles.active, activeClass ])} />
  );
});
AbstractNavItem.displayName = 'AbstractNavItem';
AbstractNavItem.propTypes = propTypes;
AbstractNavItem.defaultProps = defaultProps;
export default AbstractNavItem;
