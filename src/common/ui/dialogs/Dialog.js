import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { cl as classNames } from 'common/utils';
import Modal from 'common/ui/modal';
import Button from 'common/ui/button';
import * as styles from './dialogs.scss';

export default function BaseDialog ({
  dialogClassName,
  title,
  closeButton,
  onCancel,
  onSubmit,
  submitCaption = 'OK',
  cancelCaption = 'Cancel',
  children,
  ...props
}) {

  const cancel = useCallback(() => onCancel && onCancel(), [ onCancel ]);
  const submit = useCallback(() => onSubmit && onSubmit(), [ onSubmit ]);

  return (
    <Modal
      {...props}
      onHide={onCancel}
      dialogClassName={classNames(dialogClassName, styles.dialog)}
    >
      {!!title && (
        <Modal.Header closeButton={closeButton}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <span style={{ flex: '1 0 auto' }} />
        <Button variant="secondary" onClick={cancel}>{cancelCaption}</Button>
        <Button variant="primary" onClick={submit}>{submitCaption}</Button>
      </Modal.Footer>
    </Modal>
  );
}
BaseDialog.propTypes = {
  dialogClassName: PropTypes.string,
  show: PropTypes.bool,
  title: PropTypes.string,
  caption: PropTypes.string,
  value: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  submitCaption: PropTypes.string,
  cancelCaption: PropTypes.string,
  closeButton: PropTypes.bool,
};
