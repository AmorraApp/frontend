

export { default as useModalContext, ModalContext } from './useModalContext';
export { default as ModalHeader } from './ModalHeader';

import styles from './modal.scss';
import divWithClassName from '../divWithClassName';
export const ModalBody = divWithClassName(styles['modal-body'], 'ModalBody');
export const ModalFooter = divWithClassName(styles['modal-footer'], 'ModalFooter');
export const ModalTitle = divWithClassName(styles['modal-title'], 'ModalTitle', { as: 'h4' });

import Modal from './Modal';
import ModalHeader from './ModalHeader';

Modal.Body = ModalBody;
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Footer = ModalFooter;

export default Modal;
