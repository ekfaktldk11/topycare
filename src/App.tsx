import Navbar from "./clients/components/Navbar";
import { ThemeProvider, CssBaseline } from "@mui/material";
import mainTheme from "./clients/mainTheme";
import Demo from "./clients/dummy/demo";

function App() {
  return (
    <div>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <Navbar />
        <Demo />
      </ThemeProvider>
    </div>
  );
}

export default App;
