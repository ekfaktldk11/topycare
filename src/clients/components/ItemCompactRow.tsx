import { ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material";
import type { Dish } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState } from "react";
import { renderStars } from "../utils/renderStars";
import { createFeedback } from "../api/data";
import { getCurrentUser } from "aws-amplify/auth";

type ItemCompactRowProps = {
    dish: Dish;
    rating?: number;
};

export default function ItemCompactRow({ dish, rating = 0 }: ItemCompactRowProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const starScore = Math.max(0, Math.min(5, isFinite(rating) ? rating : 0));

    const handleSubmitFeedback = async (feedback: { rating: number; content?: string }) => {
        try {
            const user = await getCurrentUser();
            const result = await createFeedback(
                dish.id,
                user.userId,
                "dish",
                feedback.rating,
                feedback.content
            );

            if (result.newFeedback) {
                console.log("Feedback created successfully:", result.newFeedback);
                setDialogOpen(false);
                // TODO: 성공 메시지 표시, 리스트 새로고침
            } else {
                console.error("Failed to create feedback:", result.errors);
                // TODO: 에러 메시지 표시
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            // TODO: 에러 메시지 표시 (로그인 필요 등)
        }
    };

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
                feedbacks={[]}
                onClose={() => setDialogOpen(false)}
                onSubmitFeedback={handleSubmitFeedback}
            />
        </>
    );
}