import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircularProgress, Box } from "@mui/material";

type ProtectedRouteProps = {
    children: React.ReactElement;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

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
        // 사용자가 인증되지 않았으면 로그인 페이지로 리디렉션합니다.
        return <Navigate to="/login" replace />;
    }

    return children;
};