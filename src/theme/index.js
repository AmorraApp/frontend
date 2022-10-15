import { lazy, createContext, useContext } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import useLocalStorage from '@twipped/hooks/useLocalStorage';
import useMemoObject from '@twipped/hooks/useMemoObject';

const LC_THEME_MODE = 'theme_mode';

export const ThemeSwitchContext = createContext();
ThemeSwitchContext.displayName = 'ThemeSwitchContext';

export function useThemeSwitch () {
  return useContext(ThemeSwitchContext);
}


const cache = createCache({
  key: 'amorra',
});

const Light = lazy(() => import('./light'));
const Dark = lazy(() => import('./dark'));

const isDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
const isLight = window.matchMedia?.('(prefers-color-scheme: light)')?.matches;

const themePreference = (
  // eslint-disable-next-line no-nested-ternary
  isDark ? 'dark' : (
    isLight ? 'light' : ''
  )
);

export default function ThemeEngine ({ children }) {
  const [ mode, setThemeMode ] = useLocalStorage(LC_THEME_MODE, themePreference);

  const Theme = mode === 'dark' ? Dark : Light;

  return (
    <CacheProvider value={cache}>
      <ThemeSwitchContext.Provider value={useMemoObject({ mode, setThemeMode })}>
        <Theme>
          {children}
        </Theme>
      </ThemeSwitchContext.Provider>
    </CacheProvider>
  );
}
