
import { createContext, useContext } from 'react';

export const AuthContext = createContext();
AuthContext.displayName = 'AuthContext';

export function useAuthentication () {
  return useContext(AuthContext);
}
