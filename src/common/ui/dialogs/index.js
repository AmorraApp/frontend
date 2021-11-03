

import { useState, useCallback } from 'react';
import Confirm from './Confirm';
import Prompt from './Prompt';
import { useOrphanage } from 'common/mount';

function makePrompt (createOrphan, DialogComponent) {
  return useCallback(({ onSubmit, onCancel, ...props }) => {
    var disposer;
    const dispose = () => disposer && disposer();

    const Dialog = () => {
      const [ open, setOpen ] = useState(true);
      const cancel = useCallback(() => {
        setOpen(false);
        onCancel && onCancel();
      });
      const submit = useCallback((...args) => {
        setOpen(false);
        onSubmit && onSubmit(...args);
      });
      return <DialogComponent {...props} show={open} onCancel={cancel} onSubmit={submit} onExited={dispose} />;
    };

    disposer = createOrphan(Dialog);
  }, [ createOrphan, DialogComponent ]);
}

export default function useDialogs () {
  const { createOrphan } = useOrphanage();

  return {
    custom: (Dialog) => makePrompt(createOrphan, Dialog),
    confirm: makePrompt(createOrphan, Confirm),
    prompt: makePrompt(createOrphan, Prompt),
  };
}
