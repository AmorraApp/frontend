import { createContext, useContext } from 'react';

const ToastContext = createContext({
  onClose () { },
});
ToastContext.displayName = 'ToastContext';

export default ToastContext;

export function getToastContext () {
  return useContext(ToastContext) || {};
}
