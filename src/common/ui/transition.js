
import PropTypes from 'prop-types';
import { forwardRef, createContext, useContext, useRef, useEffect, Children, cloneElement, useCallback } from 'react';
import useGettableState from 'common/hooks/useGettableState';
import useIsTransitioning from 'common/hooks/useIsTransitioning';
import usePrevious from 'common/hooks/usePrevious';
import triggerBrowserReflow from 'common/ui/triggerBrowserReflow';
import { cl as classNames, isFunction } from 'common/utils';

export const DURATIONS = {
  shortest: 150,
  shorter: 200,
  short: 250,
  // most basic recommended timing
  standard: 300,
  // this is to be used in complex animations
  complex: 375,
  // recommended when something is entering screen
  enteringScreen: 225,
  // recommended when something is leaving screen
  leavingScreen: 195,
};

export const TransitionContext = createContext(null);
TransitionContext.displayName = 'TransitionContext';

export function useTransitionContext () {
  return useContext(TransitionContext);
}

function assignRef (ref, value) {
  if (isFunction(ref)) ref(value);
  if (ref && 'current' in ref) ref.current = value;
}

export const UNINITIALIZED = 'uninitialized';
export const UNMOUNTED = 'unmounted';

export const ENTER = 'enter';
export const ENTERING = 'entering';
export const ENTERED = 'entered';

export const EXIT = 'exit';
export const EXITING = 'exiting';
export const EXITED = 'exited';

const classProp = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
]);

const propTypes = {
  /**
   * Show the component; triggers the expand or collapse animation
   */
  in: PropTypes.bool,

  /**
   * Wait until the first "enter" transition to mount the component (add it to the DOM)
   */
  mountOnEnter: PropTypes.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is collapsed
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Run the expand animation when the component mounts, if it is initially
   * shown
   */
  appear: PropTypes.bool,

  classEnter: classProp,
  classEntering: classProp,
  classEntered: classProp,
  classExit: classProp,
  classExiting: classProp,
  classExited: classProp,

  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
};

const Transition = forwardRef(({
  in: show,
  classEnter,
  classEntering,
  classEntered,
  classExit,
  classExiting,
  classExited,
  onEnter,
  onEntering,
  onEntered,
  onExit,
  onExiting,
  onExited,
  mountOnEnter,
  unmountOnExit,
  appear,
  children,
}, parentRef) => {

  show = !!show;
  appear = !!appear;
  mountOnEnter = !!mountOnEnter;
  unmountOnExit = !!unmountOnExit;

  const targetRef = useRef();

  const [ { mode }, setState ] = useGettableState({
    entered: appear ? false : show,
    mounted: mountOnEnter ? show : true,
    mode: show // eslint-disable-line
      ? (appear ? EXITED : ENTERED)
      : (mountOnEnter ? UNMOUNTED : EXITED),
  }, { alwaysMerge: true });

  const prevMode = usePrevious(mode, UNMOUNTED);

  const motion = useIsTransitioning(targetRef);
  const prevMotion = usePrevious(motion);

  useEffect(() => {

    if (mode !== prevMode) {
      const fn = {
        [ENTER]: onEnter,
        [ENTERING]: onEntering,
        [ENTERED]: onEntered,
        [EXIT]: onExit,
        [EXITING]: onExiting,
        [EXITED]: onExited,
      }[mode];
      if (fn) fn();
    }

    switch (mode) {
    case UNMOUNTED:
      if (show) {
        if (appear) return setState({ mode: EXITED, mounted: true });
        return setState({ mode: ENTERED, mounted: true });
      }
      break;
    case EXITED:
      if (show) return setState({ mode: ENTER });
      if (unmountOnExit) return setState({ mode: UNMOUNTED });
      break;
    case ENTER:
      triggerBrowserReflow(targetRef.current);
      if (!show) return setState({ mode: EXIT });
      setTimeout(() => setState({ mode: ENTERING }), 1);
      break;
    case ENTERING:
      if (!show) return setState({ mode: EXITING });
      if (!motion && prevMotion) return setState({ mode: ENTERED });
      break;
    case ENTERED:
      if (!show) return setState({ mode: EXIT });
      break;
    case EXIT:
      if (show) return setState({ mode: ENTERING });
      setTimeout(() => setState({ mode: EXITING }), 1);
      break;
    case EXITING:
      if (show) return setState({ mode: ENTERING });
      if (!motion) return setState({ mode: EXITED });
      break;

    // no default
    }
  });

  const stateClass = {
    [UNMOUNTED]: classExited,
    [EXIT]: classExit || classEntering,
    [EXITING]: classExiting,
    [EXITED]: classExited,
    [ENTER]: classEnter || classExiting,
    [ENTERING]: classEntering,
    [ENTERED]: classEntered,
  }[mode];

  const child = Children.only(children);
  const childRef = child.ref;

  const newChild = cloneElement(child, {
    ref: useCallback((node) => {
      assignRef(parentRef, node);
      assignRef(childRef, node);
      targetRef.current = node;
    }, [ parentRef, childRef, targetRef ]),
    className: classNames(child.props.className, stateClass),
    'data-mode': mode,
  });

  return mode !== UNMOUNTED && <TransitionContext.Provider value={{ mode }}>{newChild}</TransitionContext.Provider>;

});
Transition.displayName = 'Transition';
Transition.propTypes = propTypes;

export default Transition;
