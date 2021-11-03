
import { createContext, useContext } from 'react';

const DropdownContext = createContext(null);
DropdownContext.displayName = 'DropdownContext';

export default function useDropdownContext () {
  return useContext(DropdownContext);
}

const DropdownProvider = DropdownContext.Provider;

export {
  DropdownContext,
  DropdownProvider,
};
