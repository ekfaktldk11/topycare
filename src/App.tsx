import { ThemeProvider, CssBaseline } from "@mui/material";
import mainTheme from "./clients/mainTheme";
import TimelineDish from "./clients/pages/TimeLineDish";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./clients/pages/LoginPage";
import { AuthProvider } from "./clients/context/AuthContext";
import { ProtectedRoute } from "./clients/components/ProtectedRoute";
import { AdminRoute } from "./clients/components/AdminRoute";
import ProfilePage from "./clients/pages/ProfilePage";
import AdminPage from "./clients/pages/AdminPage";
import Layout from "./clients/components/Layout";
import KnowHowPage from "./clients/pages/KnowHowPage";

function App() {
    return (
        <ThemeProvider theme={mainTheme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            {/* 공개 경로 */}
                            <Route path="/" element={<TimelineDish />} />
                        <Route path="/dish" element={<TimelineDish />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/knowhow" element={<KnowHowPage />} />

                        {/* 보호된 경로 */}
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        {/* 관리자 전용 경로 */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminPage />
                                </AdminRoute>
                            }
                        />
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
