import { createContext, useContext } from 'react';

const TabContext = createContext(null);
TabContext.displayName = 'TabContext';
export default TabContext;

export function useTabContext () {
  return useContext(TabContext);
}
