import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import type { Item } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState, useEffect } from "react";
import { renderStars } from "../utils/renderStars";
import { createFeedback, getAverageRating, getFeedbacks } from "../api/data";
import type { Schema } from "../../../amplify/data/resource";

type ItemCardProps = {
    item: Item;
    onZoom: (src: string) => void;
    rating?: number;
};

export default function ItemCard({ item, onZoom, rating = 0 }: ItemCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [starScore, setStarScore] = useState(Math.max(0, Math.min(5, isFinite(rating) ? rating : 0)));
    const [feedbacks, setFeedbacks] = useState<Schema["Feedback"]["type"][]>([]);

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
    }, [item.id, item.itemType]);

    useEffect(() => {
        const fetchFeedbackList = async () => {
            const { feedbacks: feedbackList, errors } = await getFeedbacks(item.id, item.itemType);
            if (errors) {
                console.error("Error fetching feedbacks:", errors);
            } else if (feedbackList) {
                setFeedbacks(feedbackList);
            }
        };
        if (dialogOpen) {
            fetchFeedbackList();
        }
    }, [dialogOpen, item.id, item.itemType]);

    const handleSubmitFeedback = async (feedback: { rating: number; content?: string }) => {
        try {
            const result = await createFeedback(
                item.id,
                item.itemType,
                feedback.rating,
                feedback.content,
            );

            if (result.newFeedback) {
                // setDialogOpen(false);
                // Refresh rating and feedbacks
                const { averageRating } = await getAverageRating(item.id, item.itemType);
                if (averageRating !== null) {
                    setStarScore(Math.max(0, Math.min(5, averageRating)));
                }
                const { feedbacks: feedbackList } = await getFeedbacks(item.id, item.itemType);
                if (feedbackList) {
                    setFeedbacks(feedbackList);
                }
            } else if (result.duplicated) {
                return;
            } else {
                console.error("Failed to create feedback:", result.errors);
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
    };

    const refreshFeedbacks = async () => {
        const { feedbacks: feedbackList } = await getFeedbacks(item.id, item.itemType);
        if (feedbackList) {
            setFeedbacks(feedbackList);
        }
        const { averageRating } = await getAverageRating(item.id, item.itemType);
        if (averageRating !== null) {
            setStarScore(Math.max(0, Math.min(5, averageRating)));
        }
    };

    return (
        <>
            <Card variant="outlined" sx={{ height: "100%" }} onClick={() => setDialogOpen(true)}>
                <Box sx={{ p: 1.5, height: "100%" }}>
                    <Stack direction="row" gap={1.5} alignItems="stretch">
                        {/* 이미지 */}
                        <Box
                            sx={{
                                width: 112,
                                minWidth: 112,
                                height: 112,
                                borderRadius: 1.25,
                                overflow: "hidden",
                                position: "relative",
                                bgcolor: "action.hover",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <IconButton
                                aria-label="이미지 확대"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onZoom(item.img);
                                }}
                                sx={{ position: "absolute", right: 4, top: 4, bgcolor: "rgba(0,0,0,0.45)", color: "common.white", "&:hover": { bgcolor: "rgba(0,0,0,0.6)" } }}
                                size="small"
                            >
                                <ZoomInIcon fontSize="inherit" />
                            </IconButton>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.img}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.src = "";
                                }}
                            />
                        </Box>

                        {/* 텍스트/메타 */}
                        <CardContent sx={{ p: 0, flex: 1, minWidth: 0 }}>
                            <Stack gap={0.75} sx={{ height: "100%" }}>
                                <Typography variant="subtitle1" component="h3" noWrap title={item.name} sx={{ fontWeight: 700 }}>
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap title={item.brand}>
                                    {item.brand}
                                </Typography>
                                <Stack gap={0.5} mt="auto">
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="caption" color="text.secondary">
                                            영향도
                                        </Typography>
                                        <Stack direction="row" alignItems="center" gap={0.5}>
                                            {renderStars(starScore)}
                                            <Typography variant="caption" sx={{ fontVariantNumeric: "tabular-nums", ml: 0.5 }}>
                                                {starScore.toFixed(1)} / 5
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Stack>
                </Box>
            </Card>
            <FeedbackDialog
                open={dialogOpen}
                item={item}
                feedbacks={feedbacks}
                onClose={() => setDialogOpen(false)}
                onSubmitFeedback={handleSubmitFeedback}
                onFeedbackUpdate={refreshFeedbacks}
            />
        </>
    );
}