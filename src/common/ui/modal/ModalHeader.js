import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import useEventCallback from 'common/hooks/useEventCallback';

import CloseButton from '../close-button';
import useModalContext from './useModalContext';
import styles from './modal.scss';

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
  /**
     * A Callback fired when the close button is clicked. If used directly inside
     * a Modal component, the onHide will automatically be propagated up to the
     * parent Modal `onHide`.
     */
  onHide: PropTypes.func,
};
const defaultProps = {
  closeLabel: 'Close',
  closeButton: false,
};

const ModalHeader = forwardRef(({
  closeLabel,
  closeButton,
  onHide,
  className,
  children,
  ...props
}, ref) => {
  const modal = useModalContext();

  const handleClick = useEventCallback(() => {
    if (modal.props.onHide) modal.props.onHide();
    if (onHide) onHide();
  });

  return (
    <div ref={ref} {...props} className={classNames(className, styles['modal-header'])}>
      {children}

      {closeButton && (
        <CloseButton className={styles.close} label={closeLabel} onClick={handleClick} />
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';
ModalHeader.propTypes = propTypes;
ModalHeader.defaultProps = defaultProps;
export default ModalHeader;
