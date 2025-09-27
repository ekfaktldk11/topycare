import { ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import type { Dish, Feedback } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState } from "react";

const dummyFeedbacks: Feedback[] = [
    { id: 1, userId: 1, productType: "dish", productId: 1, rating: 5, content: "Amazing!", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, userId: 2, productType: "dish", productId: 1, rating: 4, content: "Pretty good.", createdAt: new Date(), updatedAt: new Date() },
];

type ItemCompactRowProps = {
    dish: Dish;
};

const renderStars = (score: number) => {
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

export default function ItemCompactRow({ dish }: ItemCompactRowProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const starScore = Math.max(0, Math.min(5, isFinite(dish.affect) ? dish.affect : 0));

    return (
        <>
            <ListItem disablePadding divider onClick={() => setDialogOpen(true)}>
                <ListItemButton>
                    <ListItemText
                        primary={
                            <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap title={dish.name}>
                                    {dish.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap title={dish.brand}>
                                    {dish.brand}
                                </Typography>
                                <Stack direction="row" alignItems="center" sx={{ ml: { sm: "auto" } }}>
                                    {renderStars(starScore)}
                                    <Typography variant="body2" sx={{ ml: 0.5, fontVariantNumeric: "tabular-nums" }}>
                                        {starScore.toFixed(1)} / 5
                                    </Typography>
                                </Stack>
                            </Stack>
                        }
                    />
                </ListItemButton>
            </ListItem>
            <FeedbackDialog
                open={dialogOpen}
                dish={dish}
                feedbacks={dummyFeedbacks}
                onClose={() => setDialogOpen(false)}
                onSubmitFeedback={(feedback) => console.log("New feedback:", feedback)}
            />
        </>
    );
}