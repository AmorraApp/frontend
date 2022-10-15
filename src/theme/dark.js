import { ThemeProvider, createTheme } from '@mui/material/styles';
import { typography } from './typography';
import styleTheme from './styles';

export const palette = {
  type: 'dark',
  surface: {
    main: '#243850',
    light: '#39587b',
    dark: '#1b2a3a',
  },
  primary: {
    main: '#6d628f',
    light: '#9c8fbf',
    dark: '#413861',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#b596f4',
    contrastText: '#000000',
  },
  success: {
    light: '#35DF90',
    main: '#20BA72',
    dark: '#198F58',
    contrastText: '#000000',
  },
  warning: {
    light: '#FAC661',
    main: '#F1AD2E',
    dark: '#E39808',
    contrastText: '#000000',
  },
  info: {
    light: '#33A8FF',
    main: '#0190F8',
    dark: '#0071C3',
    contrastText: '#000000',
  },
  error: {
    light: '#F47961',
    main: '#E84E2F',
    dark: '#D72F10',
    contrastText: '#ffffff',
  },
};

export const theme = styleTheme(createTheme({
  palette,
  typography,
}));

export default function DarkTheme ({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
