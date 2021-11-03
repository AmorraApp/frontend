/* eslint react/prop-types:0 */
import { createContext, useContext } from 'react';
import useKalendaeProps from './useKalendaeProps';

export const KalendaeContext = createContext(null);
KalendaeContext.displayName = 'KalendaeContext';

export const KalendaeContextProvider = ({ context, children }) => {
  if (useContext(KalendaeContext)) return children;

  return (
    <KalendaeContext.Provider value={context}>
      {children}
    </KalendaeContext.Provider>
  );
};

export function prepareKalendaeContext (props) {
  return useContext(KalendaeContext) || useKalendaeProps(props);
}

export default function useKalendaeContext () {
  return useContext(KalendaeContext) || {};
}
