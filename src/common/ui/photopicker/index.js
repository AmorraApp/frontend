
import Modal from 'common/ui/modal';
import PropTypes from 'prop-types';
import { useCallback, useState, useRef } from 'react';
import { cl as classNames, isArray } from 'common/utils';
import Button from 'common/ui/button';
import * as styles from './photopicker.scss';
import useDerivedState from 'common/hooks/useDerivedState';
import useStableMemo from 'common/hooks/useStableMemo';
import Image from 'common/ui/image';

function PhotoPicker ({ show, images, value: oValue, onCancel, onSubmit, ...props }) {

  if (!isArray(images)) throw new TypeError('PhotoPicker did not receive an array of images');

  const [ value, setValue, getValue ] = useDerivedState(oValue || images[0], [ oValue ]);

  const handleSubmit = useCallback(() => {
    onSubmit && onSubmit(getValue());
  }, [ onSubmit ]);

  return (
    <Modal {...props} show={show} onHide={onCancel} dialogClassName={styles.dialog} scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Choose a Photo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.grid}>
          {images.map((img) => (
            <PickerOption key={img.src} src={img.src} eventKey={img} active={img.src === value.src} onClick={setValue} />
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <span style={{ flex: '1 0 auto' }} />
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Choose</Button>
      </Modal.Footer>
    </Modal>
  );
}
PhotoPicker.propTypes = {
  show: PropTypes.bool,
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
  value: PropTypes.shape({
    src: PropTypes.string,
  }),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default PhotoPicker;

function PickerOption ({ src, eventKey, active, onClick }) {

  const cellRef = useRef();

  return (
    <div
      ref={cellRef}
      onClick={useCallback(() => onClick(eventKey))}
      className={classNames(
        styles.option,
        active && styles.active,
      )}
    >
      <Image
        src={src}
        spinner
        rounded
        className={styles.image}
      />
    </div>
  );
}
PickerOption.propTypes = {
  src: PropTypes.string.isRequired,
  eventKey: PropTypes.any.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};


import { useOrphanage } from 'common/mount';
export function usePhotoPicker () {
  const { createOrphan } = useOrphanage();
  const create = useStableMemo(() => function ({ onCancel, onSubmit, ...props }) {
    var disposer;
    const dispose = () => disposer && disposer();

    const Snack = () => {
      const [ open, setOpen ] = useState(true);
      const cancel = useCallback(() => {
        setOpen(false);
        onCancel && onCancel();
      });
      const submit = useCallback((...args) => {
        setOpen(false);
        onSubmit && onSubmit(...args);
      });
      return <PhotoPicker {...props} show={open} onCancel={cancel} onSubmit={submit} onExited={dispose} />;
    };

    disposer = createOrphan(Snack);
  }, []);

  return create;
}
