import { List } from "@mui/material";
import type { Schema } from "../../../../amplify/data/resource";
import FeedbackItem from "./FeedbackItem";

interface FeedbackListProps {
    feedbacks: Schema["Feedback"]["type"][];
    onFeedbackUpdate: () => void;
}

export default function FeedbackList({ feedbacks, onFeedbackUpdate }: FeedbackListProps) {
    return (
        <List disablePadding>
            {feedbacks.map((feedback) => (
                <FeedbackItem
                    key={feedback.id}
                    feedback={feedback}
                    onUpdate={onFeedbackUpdate}
                    onDelete={onFeedbackUpdate}
                />
            ))}
        </List>
    );
}