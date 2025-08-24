import { createTheme } from "@mui/material/styles";

// 색상 팔레트 정의
const mainTheme = createTheme({
  palette: {
    primary: {
      main: "#1B1B1B", // button, accent (text), icon
      light: "#3A3A3A", // hover
      dark: "#000000", // activated
      contrastText: "#ffffff",
    },
    background: {
      default: "#f4f6f8",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default mainTheme;
