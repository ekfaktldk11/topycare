import { List, ListItem, ListItemText, Stack, Typography } from "@mui/material";
import { renderStars } from "../../utils/renderStars";
import type { Feedback } from "../../types";

interface FeedbackListProps {
    feedbacks: Feedback[];
}

export default function FeedbackList({ feedbacks }: FeedbackListProps) {
    return (
        <List disablePadding>
            {feedbacks.map((feedback) => (
                <ListItem key={feedback.itemId} divider>
                    <ListItemText
                        primary={
                            <Stack direction="row" alignItems="center" gap={0.5}>
                                {renderStars(feedback.rating)}
                                <Typography variant="body1" fontWeight={600}>
                                    {feedback.rating} / 5
                                </Typography>
                            </Stack>
                        }
                        secondary={feedback.content}
                    />
                </ListItem>
            ))}
        </List>
    );
}