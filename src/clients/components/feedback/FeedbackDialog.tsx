import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackDialogHeader from "./FeedbackDialogHeader";
import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";
import type { Dish, Feedback } from "../../types";

interface FeedbackDialogProps {
    open: boolean;
    dish: Dish;
    feedbacks: Feedback[];
    onClose: () => void;
    onSubmitFeedback: (feedback: { rating: number; content?: string }) => void;
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
            <DialogTitle sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Feedback</span>
                <IconButton onClick={onClose} size="small" aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
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