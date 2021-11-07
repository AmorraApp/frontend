
import { useRef } from 'react';
import { useTimeout } from 'common/hooks/useTimers';
import useViewManager from '../lib/useViewManager';


export default function KalendaeViewResetter ({ focused }) {
  const lastState = useRef(focused);
  const view = useViewManager();
  const timer = useTimeout();
  let update = false;

  if (lastState.current !== focused) {
    lastState.current = focused;
    update = true;
  }

  if (!update || !lastState.current) return null;

  timer.set(() => {
    if (lastState.current) view.updateForSelectionIfNeeded();
  }, 9);

  return null;
}
