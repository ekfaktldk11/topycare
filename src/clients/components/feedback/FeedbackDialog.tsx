import { Dialog, DialogContent, Stack } from "@mui/material";
import FeedbackDialogHeader from "./FeedbackDialogHeader";
import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";
import type { Dish, Feedback } from "../../types";

interface FeedbackDialogProps {
    open: boolean;
    dish: Dish;
    feedbacks: Feedback[];
    onClose: () => void;
    onSubmitFeedback: (feedback: string) => void;
}

export default function FeedbackDialog({
    open,
    dish,
    feedbacks,
    onClose,
    onSubmitFeedback,
}: FeedbackDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column", height: "70vh" }}>
                <FeedbackDialogHeader dish={dish} />
                <Stack sx={{ flex: 1, overflow: "auto" }}>
                    <FeedbackList feedbacks={feedbacks} />
                </Stack>
                <FeedbackForm onSubmit={onSubmitFeedback} />
            </DialogContent>
        </Dialog>
    );
}