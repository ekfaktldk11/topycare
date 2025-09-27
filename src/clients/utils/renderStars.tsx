import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type { ReactNode } from "react";

export const renderStars = (score: number): ReactNode[] => {
    const stars = [];
    const rounded = Math.round(score * 2) / 2;
    for (let i = 1; i <= 5; i++) {
        if (rounded >= i) {
            stars.push(<StarIcon key={i} fontSize="small" sx={{ color: "#FFD700" }} />);
        } else if (rounded >= i - 0.5) {
            stars.push(<StarIcon key={i} fontSize="small" sx={{ color: "#FFD700", opacity: 0.5 }} />);
        } else {
            stars.push(<StarBorderIcon key={i} fontSize="small" sx={{ color: "#FFD700" }} />);
        }
    }
    return stars;
};