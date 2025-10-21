import { ThemeProvider, CssBaseline } from "@mui/material";
import mainTheme from "./clients/mainTheme";
import Navbar from "./clients/components/Navbar";
import TimelineDish from "./clients/pages/TimeLineDish";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./clients/pages/LoginPage";
import { AuthProvider } from "./clients/context/AuthContext"; // AuthProvider 임포트
import { ProtectedRoute } from "./clients/components/ProtectedRoute"; // ProtectedRoute 임포트

function App() {
    return (
        <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            <AuthProvider>
                {" "}
                {/* AuthProvider로 전체 앱을 감쌉니다. */}
                <Router>
                    <Navbar />
                    <Routes>
                        {/* 공개 경로 */}
                        <Route path="/" element={<TimelineDish />} />
                        <Route path="/dish" element={<TimelineDish />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* 보호된 경로 */}
                        <Route
                            path=""
                            element={
                                <ProtectedRoute>
                                    <div>임시</div>
                                </ProtectedRoute>
                            }
                        />

                        {/* 다른 페이지 Route 추가 가능 */}
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
