import { Box, Container, Typography, Link } from "@mui/material";
import { Pets, ContentCopy } from "@mui/icons-material";
import { useSnackbar } from "./Snackbar";

export default function Footer() {
    const { showMessage } = useSnackbar();
    
    const handleCopyAccount = () => {
        navigator.clipboard.writeText("3333-30-9649007");
        showMessage("계좌번호가 복사되었습니다!\n3333-30-9649007", "success");
    };

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: "auto",
                backgroundColor: (theme) =>
                    theme.palette.mode === "light"
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            <Container maxWidth="lg">
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        © 2025 Topycare. Made with ❤️ for 진도리
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Pets sx={{ fontSize: 20, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                            진도리 간식비 후원:
                        </Typography>
                        <Link
                            component="button"
                            variant="body2"
                            onClick={handleCopyAccount}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            3333-30-9649007 (카카오뱅크)
                            <ContentCopy sx={{ fontSize: 14 }} />
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}
