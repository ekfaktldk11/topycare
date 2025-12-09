import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ImageIcon from "@mui/icons-material/Image";
import type { Item } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState, useEffect } from "react";
import { renderSeverityDots } from "../utils/renderSeverityDots";
import { createFeedback, getAverageRating, getFeedbacks } from "../api/data";
import type { Schema } from "../../../amplify/data/resource";
import { getUrl } from "aws-amplify/storage";

type ItemCardProps = {
    item: Item;
    onZoom: (src: string) => void;
    rating?: number;
};

// ✅ URL 여부 판단 헬퍼 함수
const isUrl = (str: string) => {
    return str?.startsWith("http://") || str?.startsWith("https://");
};

export default function ItemCard({ item, onZoom, rating = 0 }: ItemCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [severityScore, setSeverityScore] = useState(Math.max(0, Math.min(5, isFinite(rating) ? rating : 0)));
    const [feedbacks, setFeedbacks] = useState<Schema["Feedback"]["type"][]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(true);

    // ✅ 이미지 URL 로드 (S3 or 직접 URL)
    useEffect(() => {
        const loadImage = async () => {
            if (!item.img) {
                setImageUrl(null);
                setImageLoading(false);
                return;
            }

            // URL인 경우 바로 사용
            if (isUrl(item.img)) {
                setImageUrl(item.img);
                setImageLoading(false);
                return;
            }

            // S3 key인 경우 getUrl로 presigned URL 가져오기
            try {
                const result = await getUrl({
                    path: item.img,
                });
                setImageUrl(result.url.toString());
            } catch (error) {
                console.error("Failed to load image from S3:", error);
                setImageUrl(null);
            } finally {
                setImageLoading(false);
            }
        };

        loadImage();
    }, [item.img]);

    useEffect(() => {
        const fetchRating = async () => {
            const { averageRating, errors } = await getAverageRating(item.id, item.itemType);
            if (errors) {
                console.error("Error fetching average rating:", errors);
            } else if (averageRating !== null) {
                setSeverityScore(Math.max(0, Math.min(5, averageRating)));
            }
        };
        fetchRating();
    }, [item.id, item.itemType]);

    useEffect(() => {
        const fetchFeedbackList = async () => {
            const { feedbacks: feedbackList } = await getFeedbacks(item.id, item.itemType);
            if (feedbackList) {
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
                feedback.content
            );

            if (result.newFeedback) {
                const { feedbacks: feedbackList } = await getFeedbacks(item.id, item.itemType);
                if (feedbackList) {
                    setFeedbacks(feedbackList);
                }
                const { averageRating } = await getAverageRating(item.id, item.itemType);
                if (averageRating !== null) {
                    setSeverityScore(Math.max(0, Math.min(5, averageRating)));
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

    const handleUpdateFeedbacks = async () => {
        const { feedbacks: feedbackList } = await getFeedbacks(item.id, item.itemType);
        if (feedbackList) {
            setFeedbacks(feedbackList);
        }
        const { averageRating } = await getAverageRating(item.id, item.itemType);
        if (averageRating !== null) {
            setSeverityScore(Math.max(0, Math.min(5, averageRating)));
        }
    };

    return (
        <>
            <Card
                sx={{
                    width: 200,
                    cursor: "pointer",
                    transition: "0.2s",
                    "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => setDialogOpen(true)}
            >
                {/* ✅ 이미지 영역 (fallback 처리) */}
                <Box
                    sx={{
                        width: 200,
                        height: 200,
                        position: "relative",
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {imageLoading ? (
                        <Typography variant="body2" color="text.secondary">
                            로딩 중...
                        </Typography>
                    ) : imageUrl ? (
                        <>
                            <IconButton
                                aria-label="이미지 확대"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onZoom(imageUrl);
                                }}
                                sx={{
                                    position: "absolute",
                                    right: 4,
                                    top: 4,
                                    bgcolor: "rgba(0,0,0,0.45)",
                                    color: "common.white",
                                    "&:hover": { bgcolor: "rgba(0,0,0,0.6)" },
                                }}
                                size="small"
                            >
                                <ZoomInIcon fontSize="inherit" />
                            </IconButton>
                            <img
                                src={imageUrl}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                }}
                            />
                        </>
                    ) : (
                        // ✅ 이미지가 없을 때 fallback UI
                        <Stack alignItems="center" spacing={1}>
                            <ImageIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                            <Typography variant="caption" color="text.secondary">
                                이미지 준비중
                            </Typography>
                        </Stack>
                    )}
                </Box>

                {/* 텍스트/메타 */}
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                        {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                        {item.brand}
                    </Typography>
                    <Stack direction="row" alignItems="center" gap={0.5} sx={{ mt: 1 }}>
                        {renderSeverityDots(severityScore)}
                        <Typography variant="body2" fontWeight={600}>
                            {severityScore.toFixed(1)} / 5
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>

            <FeedbackDialog
                open={dialogOpen}
                item={item}
                feedbacks={feedbacks}
                onClose={() => setDialogOpen(false)}
                onSubmitFeedback={handleSubmitFeedback}
                onFeedbackUpdate={handleUpdateFeedbacks}
            />
        </>
    );
}