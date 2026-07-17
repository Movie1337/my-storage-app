import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#245e52',
      dark: '#173f38',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a85d32',
    },
    background: {
      default: '#f5f6f4',
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
      fontSize: '2.1rem',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h2: {
      fontSize: '1.2rem',
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
