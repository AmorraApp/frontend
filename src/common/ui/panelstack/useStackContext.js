/* eslint react/prop-types:0 */

import { createContext, useContext, useCallback, useRef } from 'react';
import { isArray, isString } from 'common/utils';
import useStableMemo from 'common/hooks/useStableMemo';
import useGettableState from 'common/hooks/useGettableState';
import { useDeferredLoop } from 'common/hooks/useTimers';
import usePageHashContext from 'common/hooks/usePageHashContext';

export const PanelStackContext = createContext(null);
PanelStackContext.displayName = 'PanelStackContext';

export default function useStackContext () {
  return useContext(PanelStackContext);
}

function parsePath (input) {
  if (isArray(input)) return input;
  if (isString(input)) return input.split('/');
  return [ '' ];
}

export function PanelStackProvider ({ track: trackRef, variant, initialPath, onChange, pageHashKey, children }) {
  const rootRef = useRef();
  const [ , setHistoryState, getHistoryState ] = useGettableState({
    past: [],
    present: [],
    future: [],
  });

  if (pageHashKey === true) pageHashKey = 'panel-path';

  const { hash: pageHash, push: pushHash } = usePageHashContext();

  if (pageHashKey && pageHash[pageHashKey]) initialPath = pageHash[pageHashKey];
  const initialPathRef = useRef();
  initialPathRef.current = initialPath ? parsePath(initialPath) : null;

  const scrollerCounter = useRef(0);
  const endScroller = useDeferredLoop(() => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = track.scrollWidth - track.clientWidth;
  });

  const trackAnimation = useStableMemo(() => ({
    start () {
      scrollerCounter.current++;
      endScroller.start();
    },
    stop () {
      scrollerCounter.current = Math.max(0, scrollerCounter.current - 1);
      if (!scrollerCounter.current) endScroller.stop();
    },
  }), [ scrollerCounter, endScroller ]);

  const history = useStableMemo(() => ({
    back () {
      let { past, present, future } = getHistoryState();
      if (!present.length || !past.length) return;
      future.push(present);
      present = past.pop();
      setHistoryState({ past, present, future });
      if (pageHashKey) pushHash({ [pageHashKey]: present.join('/') });
      onChange && onChange(present);
    },

    forward () {
      let { past, present, future } = getHistoryState();
      if (!future.length) return;
      past.push(present);
      present = future.pop();
      setHistoryState({ past, present, future });
      if (pageHashKey) pushHash({ [pageHashKey]: present.join('/') });
      onChange && onChange(present);
    },

    push (target, from) {
      let { past, present, future } = getHistoryState();
      if (present?.length) past.push(present);
      future = [];

      target = parsePath(target);
      from = from && from.length ? parsePath(from) : present;


      // if the first element of target is an empty string, that means it started
      // with a slash, so we're working from root. Otherwise assume relative path
      present = target[0] === ''
        ? target
        : [ ...from, ...target ]
      ;

      setHistoryState({ past, present, future });
      if (pageHashKey) pushHash({ [pageHashKey]: present.join('/') });
      onChange && onChange(present);
    },

    get location () {
      const { present } = getHistoryState();
      return present.join('/');
    },

    get _seed () {
      return rootRef.current;
    },

    set _seed (root) {
      rootRef.current = root;
      const present = initialPathRef.current?.length ? initialPathRef.current : root;
      setHistoryState({ past: [], present, future: [] });
      if (pageHashKey) pushHash({ [pageHashKey]: present.join('/') });
      onChange && onChange(present);
    },
  }), [ getHistoryState ]);

  const isActive = useCallback((path) => {
    const { present } = getHistoryState();
    for (const [ i, v ] of path.entries()) {
      if (present[i] !== v) return false;
    }
    return true;
  });

  const context = {
    variant,
    isActive,
    history,
    trackAnimation,
  };

  return (
    <PanelStackContext.Provider value={context}>
      {children}
    </PanelStackContext.Provider>
  );
}
