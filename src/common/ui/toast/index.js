import { forwardRef, useEffect, useMemo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cl as classNames } from 'common/utils';
import { useTimeout } from 'common/hooks';
import Fade from '../fade';
import ToastHeader from './ToastHeader';

import ToastContext from './ToastContext';
import divWithClassName from '../divWithClassName';

import styles from './toast.scss';
export { styles as Classes };

export const ToastBody = divWithClassName(styles['toast-body'], 'ToastBody');
export {
  ToastHeader,
  ToastContext,
};

const propTypes = {
  /**
     * @default 'toast'
     */
  bsPrefix: PropTypes.string,
  /**
     * Apply a CSS fade transition to the toast
     */
  animation: PropTypes.bool,
  /**
     * Auto hide the toast
     */
  autohide: PropTypes.bool,
  /**
     * Delay hiding the toast (ms)
     */
  delay: PropTypes.number,
  /**
     * A Callback fired when the close button is clicked.
     */
  onClose: PropTypes.func,
  /**
     * When `true` The modal will show itself.
     */
  show: PropTypes.bool,
  /**
     * A `react-transition-group` Transition component used to animate the Toast on dismissal.
     */
  transition: PropTypes.elementType,
};

const Toast = forwardRef(({
  className,
  children,
  transition: Transition = Fade,
  show = true,
  animation = true,
  delay = 3000,
  autohide = false,
  onClose,
  ...props
}, ref) => {

  // We use refs for these, because we don't want to restart the autohide
  // timer in case these values change.
  const delayRef = useRef(delay);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    delayRef.current = delay;
    onCloseRef.current = onClose;
  }, [ delay, onClose ]);

  const autohideTimeout = useTimeout();
  const autohideToast = !!(autohide && show);
  const autohideFunc = useCallback(() => {
    if (autohideToast) {
      onCloseRef.current?.();
    }
  }, [ autohideToast ]);

  useEffect(() => {
    // Only reset timer if show or autohide changes.
    autohideTimeout.set(autohideFunc, delayRef.current);
  }, [ autohideTimeout, autohideFunc ]);

  const toastContext = useMemo(() => ({
    onClose,
  }), [ onClose ]);

  const hasAnimation = !!(Transition && animation);

  const YeahToast = ({ className: subClassName }) => (
    <div
      {...props}
      ref={ref}
      className={classNames(
        styles.toast,
        className,
        subClassName,
        // !hasAnimation && styles[show ? 'show' : 'hide'],
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {children}
    </div>
  );

  return (
    <ToastContext.Provider value={toastContext}>
      {hasAnimation && Transition ? (
        <Transition in={show} unmountOnExit showClass={styles.show}><YeahToast /></Transition>
      ) : (<YeahToast />)}
    </ToastContext.Provider>
  );
});

Toast.propTypes = propTypes;
Toast.displayName = 'Toast';

Toast.Body = ToastBody;
Toast.Header = ToastHeader;

export default Toast;
