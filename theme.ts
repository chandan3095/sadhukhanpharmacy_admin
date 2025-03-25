import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2EB774",
    },
    secondary: {
      main: "#7C7C7C",
    },
    background: {
      default: "#E6FEF1",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h5: {
      fontSize: "1.25rem",
      "@media (max-width:960px)": {
        fontSize: "1.125rem",
      },
    },
    button: {
      textTransform: "none",
      fontSize: "0.875rem",
      "@media (max-width:960px)": {
        fontSize: "0.75rem",
      },
    },
    body1: {
      fontSize: "1rem",
      "@media (max-width:960px)": {
        fontSize: "0.875rem",
      },
    },
    body2: {
      fontSize: "0.875rem",
      "@media (max-width:960px)": {
        fontSize: "0.75rem",
      },
    },
  },
});

export default theme;
