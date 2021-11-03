
import { createContext, useContext } from 'react';

const Context = createContext({
  expanded: false,
});
Context.displayName = 'NavbarContext';

export default Context;

export function getNavbarContext () {
  return useContext(Context) || {};
}
