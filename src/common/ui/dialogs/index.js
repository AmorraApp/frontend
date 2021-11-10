

import { useState, useCallback } from 'react';
import Confirm from './Confirm';
import Prompt from './Prompt';
import { createOrphan } from 'common/ui/mount';

export default function createDialog (DialogComponent) {
  return ({ onSubmit, onCancel, ...props }) => new Promise((resolve) => {
    var disposer;
    const dispose = () => disposer && disposer();

    const Dialog = () => {
      const [ open, setOpen ] = useState(true);

      const cancel = useCallback(() => {
        setOpen(false);
        resolve();
        onCancel && onCancel();
      });
      const submit = useCallback((...args) => {
        setOpen(false);
        resolve(args[0]);
        onSubmit && onSubmit(...args);
      });

      return (
        <DialogComponent
          {...props}
          show={open}
          onCancel={cancel}
          onSubmit={submit}
          onExited={dispose}
        />
      );
    };

    disposer = createOrphan(Dialog);
  });
}

export const prompt = createDialog(Prompt);
export const confirm = createDialog(Confirm);
