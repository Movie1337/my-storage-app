import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f6f5b',
      dark: '#164f42',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#c36a2d',
    },
    background: {
      default: '#f4f6f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1d2420',
      secondary: '#66736e',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.35rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h3: {
      fontSize: '1.05rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: 0,
    },
  },
});
