import { Container, Link, Box, IconButton, Tooltip } from "@mui/material";
import { 
    AccountCircle, 
    Login as LoginIcon,
    Restaurant as RestaurantIcon,
    Lightbulb as LightbulbIcon 
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                width: "100%",
                height: "3em",
                borderBottom: 1,
                borderColor: "divider",
                backgroundColor: "#fff",
                zIndex: 1201,
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Link
                    className="home"
                    sx={{ 
                        typography: "h6", 
                        ml: 2, 
                        mr: 2, 
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        fontWeight: 600
                    }}
                    onClick={() => navigate("/")}
                    underline="none"
                >
                    Topycare
                </Link>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
                <Tooltip title="음식">
                    <IconButton onClick={() => navigate("/dish")} color="inherit">
                        <RestaurantIcon />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="노하우">
                    <IconButton onClick={() => navigate("/knowhow")} color="inherit">
                        <LightbulbIcon />
                    </IconButton>
                </Tooltip>
                
                {!isAuthenticated ? (
                    <Tooltip title="로그인">
                        <IconButton onClick={() => navigate("/login")} color="inherit">
                            <LoginIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Tooltip title="프로필">
                        <IconButton onClick={() => navigate("/profile")} color="inherit">
                            <AccountCircle />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Container>
    );
}