import { ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import type { Item } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState, useEffect } from "react";
import { renderStars } from "../utils/renderStars";
import { createFeedback, getAverageRating } from "../api/data";
import { getCurrentUser } from "aws-amplify/auth";

type ItemCompactRowProps = {
    item: Item;
    rating?: number;
};

export default function ItemCompactRow({ item, rating = 0 }: ItemCompactRowProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [starScore, setStarScore] = useState(Math.max(0, Math.min(5, isFinite(rating) ? rating : 0)));

    useEffect(() => {
        const fetchRating = async () => {
            const { averageRating, errors } = await getAverageRating(item.id, item.itemType);
            if (errors) {
                console.error("Error fetching average rating:", errors);
            } else if (averageRating !== null) {
                setStarScore(Math.max(0, Math.min(5, averageRating)));
            }
        };
        fetchRating();
    }, [item.id]);

    const handleSubmitFeedback = async (feedback: { rating: number; content?: string }) => {
        try {
            const user = await getCurrentUser();
            const result = await createFeedback(
                item.id,
                //user.userId,
                item.itemType,
                feedback.rating,
                feedback.content
            );

            if (result.newFeedback) {
                console.log("Feedback created successfully:", result.newFeedback);
                setDialogOpen(false);
                // Refresh rating
                const { averageRating } = await getAverageRating(item.id, item.itemType);
                if (averageRating !== null) {
                    setStarScore(Math.max(0, Math.min(5, averageRating)));
                }
            } else {
                console.error("Failed to create feedback:", result.errors);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    // ... rest of component remains the same

    return (
        <>
            <ListItem disablePadding divider onClick={() => setDialogOpen(true)}>
                <ListItemButton>
                    <ListItemText
                        primary={
                            <Stack direction={{ xs: "column", sm: "row" }} gap={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                                <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap title={item.name}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap title={item.brand}>
                                    {item.brand}
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
                item={item}
                feedbacks={[]}
                onClose={() => setDialogOpen(false)}
                onSubmitFeedback={handleSubmitFeedback}
            />
        </>
    );
}