
import { createContext, useContext } from 'react';

export const MapContext = createContext(null);
MapContext.displayName = 'MapContext';

export default function useMapContext () {
  return useContext(MapContext);
}

