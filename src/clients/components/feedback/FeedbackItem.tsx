import { useState, useEffect } from "react";
import {
    ListItem,
    ListItemText,
    Stack,
    Typography,
    IconButton,
    TextField,
    Rating,
    Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { renderStars } from "../../utils/renderStars";
import type { Schema } from "../../../../amplify/data/resource";
import { updateFeedback, deleteFeedback } from "../../api/data";
import { getCurrentUser } from "aws-amplify/auth";

interface FeedbackItemProps {
    feedback: Schema["Feedback"]["type"];
    onUpdate: () => void;
    onDelete: () => void;
}

export default function FeedbackItem({ feedback, onUpdate, onDelete }: FeedbackItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(feedback.rating);
    const [editContent, setEditContent] = useState(feedback.content || "");
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        checkOwnership();
    }, []);

    const checkOwnership = async () => {
        try {
            const user = await getCurrentUser();
            console.log("Current user:", user);
            console.log("Feedback owner:", feedback.owner);
            setIsOwner(feedback.owner === user.username);
        } catch (error) {
            console.error("Error checking ownership:", error);
        }
    };

    const handleSave = async () => {
        try {
            const result = await updateFeedback(
                feedback.id,
                editRating,
                editContent
            );

            if (result.updatedFeedback) {
                console.log("Feedback updated successfully");
                setIsEditing(false);
                onUpdate();
            } else {
                console.error("Failed to update feedback:", result.errors);
            }
        } catch (error) {
            console.error("Error updating feedback:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("정말로 이 피드백을 삭제하시겠습니까?")) {
            return;
        }

        try {
            const result = await deleteFeedback(feedback.id);

            if (result.deletedFeedback) {
                console.log("Feedback deleted successfully");
                onDelete();
            } else {
                console.error("Failed to delete feedback:", result.errors);
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };

    const handleCancel = () => {
        setEditRating(feedback.rating);
        setEditContent(feedback.content || "");
        setIsEditing(false);
    };

    return (
        <ListItem
            divider
            secondaryAction={
                isOwner && (
                    <Stack direction="row" spacing={0.5}>
                        {isEditing ? (
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="save"
                                    onClick={handleSave}
                                    size="small"
                                >
                                    <SaveIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="cancel"
                                    onClick={handleCancel}
                                    size="small"
                                >
                                    <CancelIcon />
                                </IconButton>
                            </>
                        ) : (
                            <>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => setIsEditing(true)}
                                    size="small"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={handleDelete}
                                    size="small"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        )}
                    </Stack>
                )
            }
        >
            <ListItemText
                primary={
                    isEditing ? (
                        <Box>
                            <Rating
                                value={editRating}
                                onChange={(_, newValue) => setEditRating(newValue || 0)}
                                precision={0.5}
                                max={5}
                            />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                                {editRating} / 5
                            </Typography>
                        </Box>
                    ) : (
                        <Stack direction="row" alignItems="center" gap={0.5}>
                            {renderStars(feedback.rating)}
                            <Typography variant="body1" fontWeight={600}>
                                {feedback.rating} / 5
                            </Typography>
                        </Stack>
                    )
                }
                secondary={
                    isEditing ? (
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="피드백 내용을 입력하세요"
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1 }}
                        />
                    ) : (
                        feedback.content
                    )
                }
            />
        </ListItem>
    );
}