/* eslint react/prop-types:0 */
import { createContext, useContext, useMemo, useRef, useCallback } from 'react';
import usePageHashContext from 'common/hooks/usePageHashContext';
import useDerivedState from 'common/hooks/useDerivedState';
import { useDebouncedEffect } from 'common/hooks/useTimers';

import PropTypes from 'prop-types';

export const SideNavContext = createContext(null);
SideNavContext.displayName = 'SideNavContext';

const noop = () => undefined;

const propTypes = {
  /**
   * Marks the NavItem with a matching `eventKey` (or `href` if present) as active.
   *
   * @type {string}
   */
  activeKey: PropTypes.string,

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
   * If provided, this defines the key that will be used for reading and writing the currently
   * selected pane to the page url hash, preserving selected pane across page reloads.
   */
  hashKey: PropTypes.string,

  /**
   * Ref Object for the SideNav container element
   * @type {[type]}
   */
  container: PropTypes.object,
};

export const SideNavContextProvider = ({
  hashKey,
  activeKey: defaultActiveKey,
  onSelect,
  children,
  container,
}) => {
  if (useContext(SideNavContext)) return children;

  const { hash, compute: computeHash, push: pushHash } = usePageHashContext();

  const activeKeyInHash = hashKey && hash && hash[hashKey] || null;
  const initialKey = activeKeyInHash || defaultActiveKey;
  const [ activeKey, setActiveKey, getActiveKey ] = useDerivedState(initialKey, [ initialKey ]);

  const previousActiveKey = useRef(activeKey);
  useDebouncedEffect(() => {
    if (previousActiveKey.current === activeKey) return;
    if (onSelect) onSelect(activeKey, previousActiveKey.current);
    previousActiveKey.current = activeKey;
  });

  const computeHref = useCallback(
    hashKey && computeHash
      ? (newActiveKey) => computeHash({ [hashKey]: newActiveKey })
      : noop,
    [ hashKey, computeHash ],
  );

  const switchTo = useCallback((eventKey, jumpTo) => {
    if (eventKey === getActiveKey()) return;
    setActiveKey(eventKey);
    if (hashKey && pushHash) pushHash({ [hashKey]: eventKey });
    if (jumpTo && container.current) {
      container.current?.querySelector(`[name="${jumpTo}"]`)?.scrollIntoView(true);
    }
  }, [ setActiveKey, getActiveKey, pushHash, container, hashKey ]);

  const context = useMemo(() => ({
    usingHash: !!hashKey && !!pushHash,
    activeKey,
    switchTo,
    computeHref,
  }), [ activeKey, computeHref ]);

  return (
    <SideNavContext.Provider value={context}>
      {children}
    </SideNavContext.Provider>
  );
};
SideNavContextProvider.propTypes = propTypes;

export default function useSideNavContext () {
  return useContext(SideNavContext) || {};
}
