import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

interface FeedbackFormProps {
    onSubmit: (feedback: string) => void;
}

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
    const [feedback, setFeedback] = useState("");

    const handleSubmit = () => {
        if (feedback.trim()) {
            onSubmit(feedback);
            setFeedback("");
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
            <TextField
                fullWidth
                multiline
                rows={2}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Leave your feedback..."
                variant="outlined"
                sx={{ mb: 1 }}
            />
            <Button fullWidth variant="contained" color="primary" onClick={handleSubmit}>
                Submit
            </Button>
        </Box>
    );
}