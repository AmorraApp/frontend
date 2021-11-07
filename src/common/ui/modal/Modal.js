import PropTypes from 'prop-types';
import { forwardRef } from 'react';

import styles from './modal.scss';
import { cl as classNames } from 'common/utils';

import { useModal } from './useModalContext';


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
   * Add an optional extra class name to .modal-backdrop
   * It could end up looking like class="modal-backdrop foo-modal-backdrop in".
   */
  backdropClassName: PropTypes.string,

  /**
   * Close the modal when escape key is pressed
   */
  keyboard: PropTypes.bool,

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
   * A Component type that provides the modal content Markup. This is a useful
   * prop when you want to use your own styles and markup to create a custom
   * modal component.
   */
  dialogAs: PropTypes.elementType,

  /**
   * When `true` The modal will automatically shift focus to itself when it
   * opens, and replace it to the last focused element when it closes.
   * Generally this should never be set to false as it makes the Modal less
   * accessible to assistive technologies, like screen-readers.
   */
  autoFocus: PropTypes.bool,

  /**
   * When `true` The modal will prevent focus from leaving the Modal while
   * open. Consider leaving the default value here, as it is necessary to make
   * the Modal work well with assistive technologies, such as screen readers.
   */
  enforceFocus: PropTypes.bool,

  /**
   * When `true` The modal will restore focus to previously focused element once
   * modal is hidden
   */
  restoreFocus: PropTypes.bool,

  /**
   * Options passed to focus function when `restoreFocus` is set to `true`
   *
   * @link  https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#Parameters
   */
  restoreFocusOptions: PropTypes.shape({
    preventScroll: PropTypes.bool,
  }),

  /**
   * When `true` The modal will show itself.
   */
  show: PropTypes.bool,

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

  /**
   * A ModalManager instance used to track and manage the state of open
   * Modals. Useful when customizing how modals interact within a container
   */
  manager: PropTypes.object,

  /**
   * @private
   */
  container: PropTypes.any,

  'aria-labelledby': PropTypes.any,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

const defaultProps = {
  show: false,
  // backdrop: true,
  // keyboard: true,
  autoFocus: true,
  animation: true,
};

const Modal = forwardRef(({
  children,
  'aria-labelledby': ariaLabelledby,

  dialogClassName,
  contentClassName,
  dialogStyle,
  size,
  centered,
  scrollable,

  ...props
}, ref) => {

  const {
    ModalFoundation,
    modalProperties,
  } = useModal(props, ref);

  return (
    <ModalFoundation>
      <div
        {...modalProperties}
        aria-labelledby={ariaLabelledby}
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
    </ModalFoundation>
  );

});

Modal.displayName = 'Modal';
Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
