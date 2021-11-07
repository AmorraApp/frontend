
import { useState, useCallback } from 'react';
import Snackbar from './Snackbar';
import { useOrphanage } from 'common/ui/mount';

export default function useSnackbar () {
  const { createOrphan } = useOrphanage();

  return function create (props) {
    var disposer;
    const dispose = () => disposer && disposer();

    const Snack = () => {
      const [ open, setOpen ] = useState(true);
      const hide = useCallback(() => setOpen(false));
      return <Snackbar {...props} open={open} onClose={hide} onExited={dispose} />;
    };

    disposer = createOrphan(Snack);
  };
}
