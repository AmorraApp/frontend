import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';
import { ModalContext } from './useModalContext';
import ModalHeader from './ModalHeader';
import { cl as classNames, isUndefinedOrNull } from 'common/utils';
import Fade from 'common/ui/fade';

import * as styles from './modal.scss';
import divWithClassName from '../divWithClassName';
const ModalBody = divWithClassName(styles['modal-body'], 'ModalBody');
const ModalFooter = divWithClassName(styles['modal-footer'], 'ModalFooter');
const ModalTitle = divWithClassName(styles['modal-title'], 'ModalTitle', { as: 'h4' });


const propTypes = {
  /**
   * Render a large, extra large or small modal.
   * When not provided, the modal is rendered with medium (default) size.
   * @type ('sm'|'lg','xl')
   */
  size: PropTypes.string,

  /**
   * vertically center the Dialog in the window
   */
  centered: PropTypes.bool,

  /**
   * Close the modal when backdrop is clicked
   */
  backdrop: PropTypes.bool,

  /**
   * Allows scrolling the `<Modal.Body>` instead of the entire Modal when overflowing.
   */
  scrollable: PropTypes.bool,

  /**
   * Open and close the Modal with a fade animation.
   */
  animation: PropTypes.bool,

  /**
   * A css class to apply to the Modal dialog DOM node.
   */
  dialogClassName: PropTypes.string,

  /**
   * Styles to apply to the Modal dialog DOM node.
   */
  dialogStyle: PropTypes.object,

  /**
   * Add an optional extra class name to .modal-content
   */
  contentClassName: PropTypes.string,

  /**
   * When `true` The modal will show itself.
   */
  show: PropTypes.bool,

  /**
   * When `true` The modal will hide itself. This overrides the value of `show`
   */
  hide: PropTypes.bool,

  /**
   * A callback fired when the Modal is opening.
   */
  onShow: PropTypes.func,

  /**
   * A callback fired when the header closeButton or non-static backdrop is
   * clicked. Required if either are specified.
   */
  onHide: PropTypes.func,

  /**
   * A callback fired when the escape key, if specified in `keyboard`, is pressed.
   */
  onEscapeKeyDown: PropTypes.func,

  /**
   * Callback fired before the Modal transitions in
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired as the Modal begins to transition in
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the Modal finishes transitioning in
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired right before the Modal transitions out
   */
  onExit: PropTypes.func,

  /**
   * Callback fired as the Modal begins to transition out
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the Modal finishes transitioning out
   */
  onExited: PropTypes.func,


  'aria-labelledby': PropTypes.any,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};


const Modal = forwardRef(({
  children,
  'aria-labelledby': ariaLabelledby,
  className,
  style,

  dialogClassName,
  contentClassName,
  dialogStyle,
  size,
  centered,
  scrollable,

  onExit,
  onExiting,
  onExited,
  onEnter,
  onEntering,
  onEntered,

  ...props
}, ref) => {

  let show = props.show;
  if (isUndefinedOrNull(props.show) || !isUndefinedOrNull(props.hide)) {
    show = !props.hide;
  }

  const backdropClick = useCallback((ev) => {
    if (ev.currentTarget === ev.target && props.backdrop && props.onHide) {
      props.onHide();
    }
  }, [ props.backdrop, props.onHide ]);

  return (
    <ModalContext.Provider value={{ props }}>
      <Fade
        showClass={styles.show}
        fadeClass={styles.fade}
        appear
        in={!!show}
        onExit={onExit}
        onExiting={onExiting}
        onExited={onExited}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
      >
        <div
          ref={ref}
          className={classNames(
            className,
            styles.modal,
            styles['modal-static'],
          )}
          aria-hidden={show ? undefined : true}
          aria-modal={!!show}
          role={show ? 'dialog' : undefined}
          aria-labelledby={ariaLabelledby}
          onClick={backdropClick}
          style={{ display: 'block', ...style }}
        >
          <div
            className={classNames(
              dialogClassName,
              styles['modal-dialog'],
              size && styles[`modal-dialog-${size}`],
              centered && styles['modal-dialog-centered'],
              scrollable && styles['modal-dialog-scrollable'],
            )}
            style={dialogStyle}
          >
            <div className={classNames(styles['modal-content'], contentClassName)}>
              {children}
            </div>
          </div>
        </div>
      </Fade>
    </ModalContext.Provider>
  );

});

Modal.displayName = 'StaticModal';
Modal.propTypes = propTypes;
Modal.defaultProps = {
  animation: true,
};

Modal.Body = ModalBody;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Footer = ModalFooter;


export default Modal;
