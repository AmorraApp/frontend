
import { useRef } from 'react';
import { isNotUndefinedOrNull, isString, clamp } from 'common/utils';
import { useDeferredLoop } from 'common/hooks/useTimers';
import useStableMemo from 'common/hooks/useStableMemo';
import EASING from 'common/easing';

export default function useScroll (ref, baseOptions = {}) {
  if (!(ref && 'current' in ref)) throw new Error('useScroll must be passed a ref object');
  baseOptions = {
    duration: 500,
    easing: 'standard',
    ...baseOptions,
  };

  const currentMotion = useRef(0);

  const animationLoop = useDeferredLoop(() => {
    if (!currentMotion.current) {
      animationLoop.stop();
      return;
    }

    const track = ref.current;
    if (!track) return;

    const { start, target, started, duration, easing } = currentMotion.current;

    const now = Date.now();
    const elapsed = now - started;
    const position = easing(clamp(elapsed / duration, 0, 1));

    const max = {
      left: track.scrollWidth - track.offsetWidth,
      top: track.scrollHeight - track.offsetHeight,
    };

    if (isNotUndefinedOrNull(target.left)) {
      const distance = clamp(target.left, 0, max.left) - start.left;
      const delta = distance * position;
      track.scrollLeft = start.left + delta;
    } else if (isNotUndefinedOrNull(target.right)) {
      const destination = clamp(max.left - target.right, 0, max.left);
      const distance = (destination - start.left);
      const delta = distance * position;
      track.scrollLeft = start.left + delta;
    }

    if (isNotUndefinedOrNull(target.top)) {
      const distance = clamp(target.top, 0, max.top) - start.top;
      const delta = distance * position;
      track.scrollTop = clamp(start.top + delta, 0, track.scrollHeight - track.offsetHeight);
    } else if (isNotUndefinedOrNull(target.bottom)) {
      const destination = clamp(max.top - target.bottom, 0, max.top);
      const distance = (destination - start.top);
      const delta = distance * position;
      track.scrollTop = start.top + delta;
    }

    if (elapsed >= duration) {
      animationLoop.stop();
      currentMotion.current = null;
    }
  });

  return useStableMemo(() => {
    const scroll = (options) => {
      options = { ...baseOptions, ...options };

      const track = ref.current;
      const start = {
        left: track.scrollLeft,
        top: track.scrollTop,
      };

      const target = {};
      if (isNotUndefinedOrNull(options.left)) {
        target.left = options.left;
      } else if (isNotUndefinedOrNull(options.right)) {
        target.right = options.right;
      } else if (isNotUndefinedOrNull(options.x)) {
        target.left = start.left + options.x;
      }

      if (isNotUndefinedOrNull(options.top)) {
        target.top = options.top;
      } else if (isNotUndefinedOrNull(options.bottom)) {
        target.bottom = options.bottom;
      } else if (isNotUndefinedOrNull(options.y)) {
        target.top = start.top + options.y;
      }

      currentMotion.current = {
        start,
        target,
        started: Date.now(),
        duration: options.duration,
        easing: (isString(options.easing) ? EASING[options.easing] : options.easing) || EASING.linear,
      };

      animationLoop.start();
    };
    scroll.halt = () => {
      animationLoop.stop();
      currentMotion.current = null;
    };

    return scroll;
  });


}
