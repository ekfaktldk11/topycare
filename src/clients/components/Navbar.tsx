// import { useState } from "react";
// import type { ChangeEvent, FormEvent } from 'react';
// import { Container, Link, Box, TextField, Button } from "@mui/material";

// interface SearchBarProps {
//     placeholder?: string;
//     onSearch: (query: string) => void;
// }

// function SearchBarInline({ placeholder = "Search...", onSearch }: SearchBarProps) {
//     const [query, setQuery] = useState("");
//     const [searched, setSearched] = useState(false);

//     const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setQuery(e.target.value);
//     };

//     const handleSubmit = (e: FormEvent) => {
//         e.preventDefault();
//         const trimmed = query.trim();
//         if (trimmed) {
//             setSearched(true);
//             onSearch(trimmed);
//         }
//     };

//     const clearSearch = () => {
//         setQuery("");
//         if (searched) setSearched(false);
//     };

//     return (
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{ display: "flex", alignItems: "center", ml: 2 }}
//       >
//         {
//           <Button
//             onClick={clearSearch}
//             sx={{ minWidth: 0, p: 0.5, mr: 1 }}
//             aria-label="Clear search"
//             disabled={query.trim().length === 0}
//           >
//             &#10005;
//           </Button>
//         }
//         <TextField
//           variant="outlined"
//           value={query}
//           onChange={handleChange}
//           placeholder={placeholder}
//           size="small"
//           sx={{
//             mr: 1,
//             width: 180,
//             "& .MuiInputBase-root": { height: 32 },
//           }}
//           autoFocus={false}
//         />
//         <Button
//           type="submit"
//           variant="contained"
//           color="primary"
//           sx={{ minWidth: 50 }}
//           disabled={!query.trim()}
//         >
//           Search
//         </Button>
//       </Box>
//     );
// }

// export default function Navbar() {
//     return (
//         <Container
//             maxWidth={false}
//             sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center", // 가운데 정렬
//                 position: "sticky",
//                 top: 0,
//                 width: "100%",
//                 height: "3em",
//                 borderBottom: 1,
//                 borderColor: "divider",
//                 backgroundColor: "#fff",
//                 zIndex: 1201,
//             }}
//         >
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//                 <Link
//                     className="home"
//                     sx={{ typography: "body1", ml: 2, mr: 2, whiteSpace: "nowrap" }}
//                     href="/"
//                     underline="none"
//                 >
//                     topycare
//                 </Link>
//                 <SearchBarInline onSearch={query => console.log("Search query", query)} />
//             </Box>
//         </Container>
//     );
// }

import { Container, Link, Box, IconButton } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";

export default function Navbar() {
    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                alignItems: "center",
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
                    sx={{ typography: "body1", ml: 2, mr: 2, whiteSpace: "nowrap" }}
                    href="/"
                    underline="none"
                >
                    topycare
                </Link>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
                <IconButton href="/profile" color="inherit">
                    <AccountCircle />
                </IconButton>
            </Box>
        </Container>
    );
}