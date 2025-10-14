import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import type { Dish } from "../types/index";
import FeedbackDialog from "./feedback/FeedbackDialog";
import { useState } from "react";
import { renderStars } from "../utils/renderStars";

type ItemCardProps = {
    dish: Dish;
    onZoom: (src: string) => void;
};

export default function ItemCard({ dish, onZoom }: ItemCardProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const starScore = Math.max(0, Math.min(5, isFinite(dish.affect) ? dish.affect : 0));

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
                                onClick={() => onZoom(dish.img)}
                                sx={{ position: "absolute", right: 4, top: 4, bgcolor: "rgba(0,0,0,0.45)", color: "common.white", "&:hover": { bgcolor: "rgba(0,0,0,0.6)" } }}
                                size="small"
                            >
                                <ZoomInIcon fontSize="inherit" />
                            </IconButton>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={dish.img}
                                alt={dish.name}
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
                                <Typography variant="subtitle1" component="h3" noWrap title={dish.name} sx={{ fontWeight: 700 }}>
                                    {dish.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap title={dish.brand}>
                                    {dish.brand}
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
                dish={dish}
                feedbacks={[]}
                onClose={() => setDialogOpen(false)}
                onSubmitFeedback={(feedback) => console.log("New feedback:", feedback)}
            />
        </>
    );
}