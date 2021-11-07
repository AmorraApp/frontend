
import PropTypes from 'prop-types';
import { forwardRef, useCallback, useState, useEffect } from 'react';
import { cl as classNames } from 'common/utils';
import styles from './snackbar.scss';
import { useTimeout } from 'common/hooks/useTimers';
import useEventCallback from 'common/hooks/useEventCallback';
import usePageFocus from 'common/hooks/usePageFocus';
import Fade from 'common/ui/fade';
import ClickAwayListener from 'common/ui/click-away';
import { DURATIONS } from 'common/ui/transition';
import SnackbarContent from './SnackbarContent';

const ANCHORS = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center-center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
];

const propTypes = {

  /**
   * The action to display. It renders after the message, at the end of the snackbar.
   */
  action: PropTypes.node,

  anchor: PropTypes.oneOf(ANCHORS),

  /**
   * The message to display.
   */
  message: PropTypes.node,

  /**
   * The visual style of the snackbar
   */
  variant: PropTypes.oneOf(VARIANTS),

  /**
   * The shadow depth to draw beneath the element
   */
  elevation: PropTypes.number,

  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool,

  /**
   * Shortcut to disable auto hide.
   * @default false
   */
  sticky: PropTypes.bool,

  /**
   * The number of milliseconds to wait before automatically calling the
   * `onClose` function. `onClose` should then set the state of the `open`
   * prop to hide the Snackbar.
   * the `null` value.
   * @default 3500
   */
  autoHideDuration: PropTypes.number,

  /**
   * The number of milliseconds to wait before dismissing after user interaction.
   * If `autoHideDuration` prop isn't specified, it does nothing.
   * If `autoHideDuration` prop is specified but `resumeHideDuration` isn't,
   * we default to `autoHideDuration / 2` ms.
   */
  resumeHideDuration: PropTypes.number,

  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default {
   *   enter: duration.enteringScreen,
   *   exit: duration.leavingScreen,
   * }
   */
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),

  /**
   * The component used for the transition.
   * [Follow this guide](/components/transitions/#transitioncomponent-prop) to learn more about the requirements for this component.
   * @default Grow
   */
  TransitionComponent: PropTypes.elementType,

  closable: PropTypes.bool,

  onClose: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
};

const Snackbar = forwardRef(({
  action,
  anchor = 'bottom-center',
  message,
  variant,
  elevation = 6,
  closable,
  onClose,
  open,
  sticky = false,
  autoHideDuration = 3500,
  resumeHideDuration,
  transitionDuration = {
    enter: DURATIONS.enteringScreen,
    exit: DURATIONS.leavingScreen,
  },
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  TransitionComponent = Fade,
  onExit,
  onExiting,
  onExited,
  onEnter,
  onEntering,
  onEntered,
  ...props
}, ref) => {

  const handleClose = useEventCallback(onClose);
  handleClose.displayName = handleClose;

  const autoHide = useTimeout(handleClose);
  const [ exited, setExited ] = useState(true);

  const pause = useCallback(() => {
    autoHide.clear();
  });

  const resume = useEventCallback(() => {
    if (open && autoHideDuration) {
      autoHide.set(resumeHideDuration || autoHideDuration * 0.5);
    }
  });

  const getPageFocus = usePageFocus({
    onChange: (focused) => {
      if (focused) resume();
      else pause();
    },
  });

  useEffect(() => {
    if (open && autoHideDuration && !sticky && getPageFocus()) {
      autoHide.set(autoHideDuration);
    }

    return () => autoHide.clear;
  }, [ open, sticky, autoHideDuration ]);


  const handleMouseEnter = useCallback((ev) => {
    onMouseEnter && onMouseEnter(ev);
    if (ev.defaultPrevented) return;
    pause();
  }, [ onMouseEnter ]);

  const handleMouseLeave = useCallback((ev) => {
    onMouseLeave && onMouseLeave(ev);
    if (ev.defaultPrevented) return;
    resume();
  }, [ onMouseLeave ]);

  const handleClickAway = (ev) => {
    onClose && onClose(ev, 'clickaway');
  };

  const handleExited = (node) => {
    setExited(true);

    onExited && onExited(node);
  };

  const handleEnter = (node, isAppearing) => {
    setExited(false);
    onEnter && onEnter(node, isAppearing);
  };

  // So we only render active snackbars.
  if (!open && exited) {
    return null;
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        {...props}
        className={classNames(styles.root, className, styles[anchor])}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        ref={ref}
      >
        <TransitionComponent
          appear
          in={open}
          timeout={transitionDuration}
          onEnter={handleEnter}
          onExited={handleExited}
          onExit={onExit}
          onExiting={onExiting}
          onEntering={onEntering}
          onEntered={onEntered}
        >
          {children || (
            <SnackbarContent
              elevation={elevation}
              variant={variant}
              message={message}
              action={action}
              closable={closable}
              onClose={closable && handleClose}
            />
          )}
        </TransitionComponent>
      </div>
    </ClickAwayListener>
  );

});
Snackbar.displayName = 'Snackbar';
Snackbar.propTypes = propTypes;
Snackbar.VARIANTS = VARIANTS;
Snackbar.ANCHORS = ANCHORS;

export default Snackbar;
