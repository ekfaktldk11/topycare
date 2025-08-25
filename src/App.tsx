import Navbar from "./clients/components/Navbar";
import { ThemeProvider, CssBaseline } from "@mui/material";
import mainTheme from "./clients/mainTheme";

function App() {
  return (
    <div>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <Navbar />
      </ThemeProvider>
    </div>
  );
}

export default App;
