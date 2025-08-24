import { Container, Link } from "@mui/material";

export default function Navbar() {
    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                position: "sticky",
                top: 0,
                width: "100%",
                height: "3em",
                borderBottom: 1,
                borderColor: "divider",
                ".home": {
                    m: "auto",
                },
                backgroundColor: "#fff",
            }}
        >
            <Link className="home" sx={{ typography: "body1" }} href="/" underline="none">
                topycare
            </Link>
        </Container>
    );
}
