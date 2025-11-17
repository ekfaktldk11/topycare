import { Box, Button, Rating, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface FeedbackFormProps {
    onSubmit: (feedback: { rating: number; content?: string }) => void;
}

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
    const [feedback, setFeedback] = useState("");
    const [rating, setRating] = useState<number>(0);

    const handleSubmit = () => {
        if (rating > 0) {
            onSubmit({ rating, content: feedback.trim() || undefined });
            setFeedback("");
            setRating(0);
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                borderTop: 1,
                borderColor: "divider",
                position: "sticky",
                bottom: 0,
                backgroundColor: "background.paper",
            }}
        >
            <Stack gap={2}>
                {/* 별점 선택 */}
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        영향도 평가 *
                    </Typography>
                    <Rating
                        name="rating"
                        value={rating}
                        onChange={(_, newValue) => setRating(newValue || 0)}
                        size="large"
                        precision={1}
                    />
                </Box>

                {/* 피드백 텍스트 */}
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="추가 의견을 남겨주세요... (선택사항)"
                    variant="outlined"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault(); // 새 줄이 입력되는 기본 동작 방지
                            handleSubmit();
                        }
                    }}
                />

                {/* 제출 버튼 */}
                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSubmit}
                    disabled={rating === 0}
                >
                    제출
                </Button>
            </Stack>
        </Box>
    );
}