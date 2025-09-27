import { ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import type { Dish, Feedback } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState } from "react";
import { renderStars } from "../utils/renderStars";

const dummyFeedbacks: Feedback[] = [
    { id: 1, userId: 1, productType: "dish", productId: 1, rating: 5, content: "Amazing!", createdAt: new Date(), updatedAt: new Date() },
    { id: 2, userId: 2, productType: "dish", productId: 1, rating: 4, content: "Pretty good.", createdAt: new Date(), updatedAt: new Date() },
    // Add more dummy feedbacks as needed
    { id: 3, userId: 3, productType: "dish", productId: 1, rating: 3, content: "It's okay.", createdAt: new Date(), updatedAt: new Date() },
    { id: 4, userId: 4, productType: "dish", productId: 1, rating: 2, content: "Not great.", createdAt: new Date(), updatedAt: new Date() },
    { id: 5, userId: 5, productType: "dish", productId: 1, rating: 1, content: "Terrible experience.", createdAt: new Date(), updatedAt: new Date() },
    { id: 6, userId: 6, productType: "dish", productId: 1, rating: 4, content: "I liked it.", createdAt: new Date(), updatedAt: new Date() },
    { id: 7, userId: 7, productType: "dish", productId: 1, rating: 5, content: "Best dish ever!", createdAt: new Date(), updatedAt: new Date() },
    { id: 8, userId: 8, productType: "dish", productId: 1, rating: 3, content: "Average taste.", createdAt: new Date(), updatedAt: new Date() },
    { id: 9, userId: 9, productType: "dish", productId: 1, rating: 2, content: "Could be better.", createdAt: new Date(), updatedAt: new Date() },
    { id: 10, userId: 10, productType: "dish", productId: 1, rating: 1, content: "Would not recommend.", createdAt: new Date(), updatedAt: new Date() },
];

type ItemCompactRowProps = {
    dish: Dish;
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