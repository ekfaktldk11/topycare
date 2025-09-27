import { List, ListItem, ListItemText, Typography } from "@mui/material";
import type { Feedback } from "../../types";

interface FeedbackListProps {
    feedbacks: Feedback[];
}

export default function FeedbackList({ feedbacks }: FeedbackListProps) {
    return (
        <List disablePadding>
            {feedbacks.map((feedback) => (
                <ListItem key={feedback.id} divider>
                    <ListItemText
                        primary={
                            <Typography variant="body1" fontWeight={600}>
                                {feedback.rating} / 5
                            </Typography>
                        }
                        secondary={feedback.content}
                    />
                </ListItem>
            ))}
        </List>
    );
}