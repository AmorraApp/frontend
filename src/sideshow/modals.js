import Button from 'common/ui/button';
import Grid from 'common/ui/grid';
import { useState } from 'react';
import Modal from 'common/ui/modal';
import styles from './sideshow.scss';
import { Monospace } from 'common/ui/text';

export default function Modals () {
  return (
    <div>
      <h2>Modal Dialogs <Monospace variant="small">common/ui/modal</Monospace></h2>
      <Grid>
        <TestModal />
      </Grid>
    </div>
  );
}


function TestModal () {

  const [ isVisible, setVisible ] = useState(false);

  const show = () => setVisible(true);
  const hide = () => setVisible(false);
  const submit = () => { console.log('Submitted'); hide(); }; // eslint-disable-line no-console

  return (
    <>
      <Button onClick={show}>Show Modal</Button>
      <Modal show={isVisible} onHide={hide} scrollable dialogClassName={styles['test-modal']} dialogStyle={{ maxWidth: 'min(95vw, 1000px)' }}>
        <Modal.Header closeButton>
          <Modal.Title>Test Modal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles['test-pattern']} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hide}>Close</Button>
          <Button variant="primary" onClick={submit}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
