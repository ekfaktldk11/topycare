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
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { renderSeverityDots } from "../../utils/renderSeverityDots";
import type { Schema } from "../../../../amplify/data/resource";
import { 
    updateFeedback, 
    deleteFeedback,
    addFeedbackUpvote,
    removeFeedbackUpvote,
    getFeedbackUpvoteCount,
    checkFeedbackUpvoted
} from "../../api/data";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/format";
import { useSnackbar } from "../Snackbar";

interface FeedbackItemProps {
    feedback: Schema["Feedback"]["type"];
    onUpdate: () => void;
    onDelete: () => void;
}

export default function FeedbackItem({ feedback, onUpdate, onDelete }: FeedbackItemProps) {
    const { user } = useAuth();
    const { showMessage } = useSnackbar();
    const [isEditing, setIsEditing] = useState(false);
    const [editRating, setEditRating] = useState(feedback.rating);
    const [editContent, setEditContent] = useState(feedback.content ?? "");
    const [isOwner, setIsOwner] = useState(false);
    const [authorDisplayName, setAuthorDisplayName] = useState("");
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [isUpvoted, setIsUpvoted] = useState(false);

    useEffect(() => {
        if (user && feedback.owner) {
            const ownerUsername = feedback.owner.split("::")[1];
            setIsOwner(ownerUsername === user.username);
        }
    }, [user, feedback.owner]);

    useEffect(() => {
        const loadAuthor = async () => {
            try {
                // feedback.author()는 Promise를 반환하는 함수입니다 (Lazy Loading)
                const author = await feedback.author();
                let nickname = author?.data?.nickname ?? "알수없음";

                if (nickname) {
                    setAuthorDisplayName(nickname);
                }
            } catch (error) {
                console.error("Failed to load author", error);
                setAuthorDisplayName("Unknown");
            }
        };
        loadAuthor();
    }, [feedback]);

    useEffect(() => {
        loadUpvoteData();
    }, [feedback.id, user]);

    const loadUpvoteData = async () => {
        try {
            const { count } = await getFeedbackUpvoteCount(feedback.id);
            setUpvoteCount(count);

            if (user) {
                const upvoted = await checkFeedbackUpvoted(feedback.id);
                setIsUpvoted(upvoted);
            }
        } catch (error) {
            console.error("Error loading upvote data:", error);
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

    const handleUpvoteToggle = async () => {
        if (!user) {
            showMessage("좋아요를 누르려면 로그인이 필요합니다.", "warning");
            return;
        }

        try {
            if (isUpvoted) {
                const result = await removeFeedbackUpvote(feedback.id);
                if (result.success) {
                    setIsUpvoted(false);
                    setUpvoteCount(prev => prev - 1);
                }
            } else {
                const result = await addFeedbackUpvote(feedback.id);
                if (result.upvote) {
                    setIsUpvoted(true);
                    setUpvoteCount(prev => prev + 1);
                }
            }
        } catch (error) {
            console.error("Error toggling upvote:", error);
        }
    };

    const showUpdatedAt = feedback.updatedAt && feedback.createdAt !== feedback.updatedAt;

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
                disableTypography
                primary={
                    isEditing ? (
                        <Box>
                            <Rating
                                value={editRating}
                                onChange={(_, newValue) => setEditRating(newValue || 0)}
                                precision={1}
                                max={5}
                            />
                            <Typography variant="caption" sx={{ ml: 1 }}>
                                {editRating} / 5
                            </Typography>
                        </Box>
                    ) : (
                        <Stack direction="row" alignItems="center" gap={0.5}>
                            {renderSeverityDots(feedback.rating)}
                            <Typography variant="body1" fontWeight={600}>
                                {feedback.rating} / 5
                            </Typography>
                        </Stack>
                    )
                }
                secondary={
                    <Box component="div" sx={{ mt: 0.5 }}>
                        {isEditing ? (
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
                            <Typography
                                variant="body2"
                                color="text.primary"
                                sx={{ whiteSpace: "pre-wrap", mb: 1 }}
                            >
                                {feedback.content}
                            </Typography>
                        )}

                        {/* ✅ 메타데이터 영역 수정: 닉네임 | 날짜 | 좋아요 */}
                        {!isEditing && (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="caption" color="text.primary" fontWeight={600}>
                                    {authorDisplayName}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    |
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatDate(feedback.createdAt)}
                                    {showUpdatedAt && " (수정됨)"}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    |
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                    <IconButton
                                        size="small"
                                        onClick={handleUpvoteToggle}
                                        color={isUpvoted ? "primary" : "default"}
                                        sx={{ padding: 0.5 }}
                                    >
                                        {isUpvoted ? (
                                            <ThumbUpIcon fontSize="small" />
                                        ) : (
                                            <ThumbUpOutlinedIcon fontSize="small" />
                                        )}
                                    </IconButton>
                                    <Typography variant="caption" color="text.secondary">
                                        {upvoteCount}
                                    </Typography>
                                </Stack>
                            </Stack>
                        )}
                    </Box>
                }
                slotProps={{
                    primary: { component: 'div' },
                    secondary: { component: 'div' },
                }}
            />
        </ListItem>
    );
}