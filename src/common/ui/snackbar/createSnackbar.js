
import { useState, useCallback } from 'react';
import Snackbar from './Snackbar';
import { createOrphan } from 'common/ui/mount';

export default function createSnackbar (props) {
  var disposer;
  const dispose = () => disposer && disposer();

  const Snack = () => {
    const [ open, setOpen ] = useState(true);
    const hide = useCallback(() => setOpen(false));
    return <Snackbar {...props} open={open} onClose={hide} onExited={dispose} />;
  };

  disposer = createOrphan(Snack);
}
