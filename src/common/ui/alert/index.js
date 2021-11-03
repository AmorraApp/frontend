import { cl as classNames } from 'common/utils';
import React from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
import useEventCallback from 'common/hooks/useEventCallback';
import Fade from 'common/ui/fade';
import CloseButton from 'common/ui/close-button';
import divWithClassName from 'common/ui/divWithClassName';
import SafeAnchor from 'common/ui/safe-anchor';
import * as styles from './alert.scss';

const AlertHeading = divWithClassName(styles['alert-heading'], 'AlertHeading', { as: 'h4' });
const AlertLink = divWithClassName(styles['alert-link'], 'AlertLink', { as: SafeAnchor });

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
];

const propTypes = {
  /**
   * The Alert visual variant
   *
   * @type {'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light'}
   */
  variant: PropTypes.oneOf(VARIANTS),

  /**
     * Renders a properly aligned dismiss button, as well as
     * adding extra horizontal padding to the Alert.
     */
  closable: PropTypes.bool,

  /**
   * Controls the visual state of the Alert.
   *
   * @controllable onClose
   */
  show: PropTypes.bool,

  /**
   * Callback fired when alert is closed.
   *
   * @controllable show
   */
  onClose: PropTypes.func,

  /**
   * Sets the text for alert close button.
   */
  closeLabel: PropTypes.string,

  /**
     * Animate the alert dismissal. Defaults to using `<Fade>` animation or use
     * `false` to disable. A custom `react-transition-group` Transition can also
     * be provided.
     */
  transition: PropTypes.oneOfType([ PropTypes.bool, PropTypes.elementType ]),
};
const defaultProps = {
  show: true,
  transition: Fade,
  closeLabel: 'Close alert',
};
const Alert = React.forwardRef((uncontrolledProps, ref) => {
  const {
    show,
    closeLabel,
    className,
    children,
    variant,
    onClose,
    closable,
    transition,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    show: 'onClose',
  });

  const handleClose = useEventCallback((e) => {
    if (onClose) {
      onClose(false, e);
    }
  });

  const Transition = transition === true ? Fade : transition;

  const classes = [
    className,
    styles.alert,
    variant && styles[`alert-${variant}`],
    closable && styles['alert-closable'],
  ];

  const alert = (
    <div
      role="alert"
      {...(Transition ? undefined : props)}
      ref={ref}
      className={classNames(classes)}
    >
      {closable && (<CloseButton onClick={handleClose} label={closeLabel} className={styles.close} tabIndex={-1} />)}
      {children}
    </div>
  );

  if (!Transition) { return show ? alert : null; }

  return (
    <Transition unmountOnExit {...props} ref={undefined} in={show}>
      {alert}
    </Transition>
  );
});

Alert.displayName = 'Alert';
Alert.defaultProps = defaultProps;
Alert.propTypes = propTypes;
Alert.Link = AlertLink;
Alert.Heading = AlertHeading;
Alert.VARIANTS = VARIANTS;
export default Alert;
