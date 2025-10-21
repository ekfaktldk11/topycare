import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box, Typography } from "@mui/material";

type AdminRouteProps = {
    children: React.ReactElement;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const { user, isLoading, isAdmin } = useAuth();

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="80vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        // 1. 비로그인 사용자는 로그인 페이지로
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // 2. 로그인했지만 관리자가 아닌 사용자는 접근 불가 페이지나 홈으로
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h5">Access Denied</Typography>
                <Typography>
                    You do not have permission to view this page.
                </Typography>
            </Box>
        );
    }

    return children;
};
