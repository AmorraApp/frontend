// import PropTypes from 'common/prop-types';
import { createContext, useContext } from 'react';

export const OverlayContext = createContext();
OverlayContext.displayName = 'OverlayContext';

export const OverlayProvider = OverlayContext.Provider;

export default function useOverlayContext () {
  return useContext(OverlayContext);
}
