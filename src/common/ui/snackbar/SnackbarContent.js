
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styles from './snackbar.scss';
import { cl as classNames } from 'common/utils';
import CloseButton from '../close-button';
import elevationShadow from 'common/ui/shadows';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
];

const SnackbarContent = forwardRef(({
  action,
  className,
  message,
  role = 'alert',
  variant,
  closable,
  onClose,
  disabled,
  elevation = 0,
  ...props
}, ref) => (
  <div
    {...props}
    className={classNames(
      className,
      styles.content,
      variant && styles['content-' + variant],
      disabled && styles.disabled,
      elevation && elevationShadow(elevation),
    )}
    role={role}
    ref={ref}
  >
    <div className={styles['content-message']}>{message}</div>
    {!!action && <div className={styles['content-action']}>{action}</div>}
    {(onClose || closable || null) && <CloseButton size="lg" variant={variant} disabled={disabled} className={styles.close} onClick={onClose} tabIndex={-1} />}
  </div>
));
SnackbarContent.displayName = 'SnackbarContent';
SnackbarContent.propTypes = {
  /**
   * The action to display. It renders after the message, at the end of the snackbar.
   */
  action: PropTypes.node,

  /**
   * The message to display.
   */
  message: PropTypes.node,

  /**
   * The ARIA role attribute of the element.
   * @default 'alert'
   */
  role: PropTypes.string,

  /**
   * The visual style of the snackbar
   */
  variant: PropTypes.oneOf(VARIANTS),

  /**
   * The shadow depth to draw beneath the element
   */
  elevation: PropTypes.number,

  closable: PropTypes.bool,

  onClose: PropTypes.func,

  disabled: PropTypes.bool,
};

export default SnackbarContent;
