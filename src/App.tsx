import { ThemeProvider, CssBaseline } from "@mui/material";
import mainTheme from "./clients/mainTheme";
import Navbar from "./clients/components/Navbar";
import TimelineDish from "./clients/pages/TimeLineDish";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./clients/pages/LoginPage";

function App() {
    return (
        <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<TimelineDish />} />
                    <Route path="/dish" element={<TimelineDish />} />
                    <Route path="/login" element={<LoginPage />} />
                    {/* 다른 페이지 Route 추가 가능 */}
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;