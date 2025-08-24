import Navbar from "./clients/components/Navbar";
import { ThemeProvider, CssBaseline } from "@mui/material";
import mainTheme from "./clients/mainTheme";
import SearchBar from "./clients/components/SearchBar";

function App() {
  return (
    <div>
      <ThemeProvider theme={mainTheme}>
        <CssBaseline />
        <Navbar />
        <SearchBar onSearch={(query) => console.log("Search query", query)} />
      </ThemeProvider>
    </div>
  );
}

export default App;
