import PropTypes from 'prop-types';
import { forwardRef, useContext, useEffect, useRef } from 'react';
import useForceUpdate from 'common/hooks/useForceUpdate';
import useMergedRefs from 'common/hooks/useMergedRefs';

import { qsa } from 'common/utils';
import NavContext from './NavContext';
import useSelectableContext, { SelectableContextProvider } from 'common/selectable-context';
import TabContext from '../tabs/TabContext';
import styles from './nav.scss';

const noop = () => { };
const propTypes = {
  onSelect: PropTypes.func.isRequired,
  as: PropTypes.elementType,
  role: PropTypes.string,
  /** @private */
  onKeyDown: PropTypes.func,
  /** @private */
  parentOnSelect: PropTypes.func,
  /** @private */
  getControlledId: PropTypes.func,
  /** @private */
  getControllerId: PropTypes.func,
  /** @private */
  activeKey: PropTypes.any,
};

const AbstractNav = forwardRef(({
  as: Component = 'ul',
  onSelect,
  activeKey,
  role,
  onKeyDown,
  ...props
}, ref) => {
  // A ref and forceUpdate for refocus, b/c we only want to trigger when needed
  // and don't want to reset the set in the effect
  const forceUpdate = useForceUpdate();
  const needsRefocusRef = useRef(false);
  const { onSelect: parentOnSelect } = useSelectableContext();
  const tabContext = useContext(TabContext);

  let getControlledId, getControllerId;
  if (tabContext) {
    role = role || 'tablist';
    activeKey = tabContext.activeKey;
    getControlledId = tabContext.getControlledId;
    getControllerId = tabContext.getControllerId;
  }
  const listNode = useRef(null);

  const getNextActiveChild = (offset) => {
    const currentListNode = listNode.current;
    if (!currentListNode) { return null; }
    const items = qsa(currentListNode, '[data-rb-event-key]:not(.' + styles.disabled + ')');
    const activeChild = currentListNode.querySelector('.' + styles.active);
    if (!activeChild) { return null; }
    const index = items.indexOf(activeChild);
    if (index === -1) { return null; }
    let nextIndex = index + offset;
    if (nextIndex >= items.length) { nextIndex = 0; }
    if (nextIndex < 0) { nextIndex = items.length - 1; }
    return items[nextIndex];
  };

  const handleSelect = (key, event) => {
    if (!key) { return; }
    if (onSelect) { onSelect(key, event); }
    if (parentOnSelect) { parentOnSelect(key, event); }
  };

  const handleKeyDown = (event) => {
    if (onKeyDown) { onKeyDown(event); }
    let nextActiveChild;
    switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      nextActiveChild = getNextActiveChild(-1);
      break;
    case 'ArrowRight':
    case 'ArrowDown':
      nextActiveChild = getNextActiveChild(1);
      break;
    default:
      return;
    }
    if (!nextActiveChild) { return; }
    event.preventDefault();
    handleSelect(nextActiveChild.dataset.rbEventKey, event);
    needsRefocusRef.current = true;
    forceUpdate();
  };

  useEffect(() => {
    if (listNode.current && needsRefocusRef.current) {
      const activeChild = listNode.current.querySelector('[data-rb-event-key].' + styles.active);
      if (activeChild) { activeChild.focus(); }
    }
    needsRefocusRef.current = false;
  });

  const mergedRef = useMergedRefs(ref, listNode);

  return (
    <SelectableContextProvider onSelect={handleSelect}>
      <NavContext.Provider
        value={{
          role,
          activeKey,
          getControlledId: getControlledId || noop,
          getControllerId: getControllerId || noop,
        }}
      >
        <Component {...props} onKeyDown={handleKeyDown} ref={mergedRef} role={role} />
      </NavContext.Provider>
    </SelectableContextProvider>
  );
});
AbstractNav.displayName = 'AbstractNav';
AbstractNav.propTypes = propTypes;
export default AbstractNav;
