import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useContext } from 'react';
import useEventCallback from 'common/hooks/useEventCallback';
import CloseButton from '../close-button';
import ToastContext from './ToastContext';
import styles from './toast.scss';
import spacing from '../grid/spacing';

const propTypes = {
  bsPrefix: PropTypes.string,
  /**
     * Provides an accessible label for the close
     * button. It is used for Assistive Technology when the label text is not
     * readable.
     */
  closeLabel: PropTypes.string,
  /**
     * Specify whether the Component should contain a close button
     */
  closeButton: PropTypes.bool,
};

const defaultProps = {
  closeLabel: 'Close',
  closeButton: true,
};

const ToastHeader = forwardRef(({
  closeLabel,
  closeButton,
  className,
  children,
  ...props
}, ref) => {

  const context = useContext(ToastContext);
  const handleClick = useEventCallback((e) => {
    if (context && context.onClose) {
      context.onClose(e);
    }
  });

  return (
    <div ref={ref} {...props} className={classNames(styles['toast-header'], className)}>
      {children}
      {closeButton && (
        <CloseButton
          label={closeLabel}
          onClick={handleClick}
          className={classNames(
            spacing.marginLeft2,
          )}
          data-dismiss="toast"
        />)}
    </div>
  );
});
ToastHeader.displayName = 'ToastHeader';
ToastHeader.propTypes = propTypes;
ToastHeader.defaultProps = defaultProps;
export default ToastHeader;
