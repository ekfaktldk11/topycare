import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FeedbackDialogHeader from "./FeedbackDialogHeader";
import FeedbackList from "./FeedbackList";
import FeedbackForm from "./FeedbackForm";
import type { Item } from "../../types";
import type { Schema } from "../../../../amplify/data/resource";

interface FeedbackDialogProps {
    open: boolean;
    item: Item;
    feedbacks: Schema["Feedback"]["type"][];
    onClose: () => void;
    onSubmitFeedback: (feedback: { rating: number; content?: string }) => void;
    onFeedbackUpdate: () => void;
}

export default function FeedbackDialog({
    open,
    item,
    feedbacks,
    onClose,
    onSubmitFeedback,
    onFeedbackUpdate,
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
                <FeedbackDialogHeader item={item} />
                <Stack sx={{ flex: 1, overflow: "auto" }}>
                    <FeedbackList feedbacks={feedbacks} onFeedbackUpdate={onFeedbackUpdate} />
                </Stack>
                <FeedbackForm onSubmit={onSubmitFeedback} />
            </DialogContent>
        </Dialog>
    );
}