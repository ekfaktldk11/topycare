import {
    Card,
    CardContent,
    Typography,
    Stack,
    IconButton,
    Chip,
    Box,
    Divider,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import EditIcon from "@mui/icons-material/Edit";
import CodeIcon from "@mui/icons-material/Code";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import type { Schema } from "../../../../amplify/data/resource";

interface KnowHowItemProps {
    knowHow: Schema["KnowHow"]["type"];
    upvoteCount: number;
    isUpvoted: boolean;
    isOwner: boolean;
    onUpvote: () => void;
    onEdit: () => void;
    onCardClick: () => void;
}

export default function KnowHowItem({
    knowHow,
    upvoteCount,
    isUpvoted,
    isOwner,
    onUpvote,
    onEdit,
    onCardClick,
}: KnowHowItemProps) {
    const createdAt = new Date(knowHow.createdAt);
    const updatedAt = new Date(knowHow.updatedAt);
    const isEdited = updatedAt.getTime() - createdAt.getTime() > 1000;

    const formatDate = (date: Date) => {
        return format(date, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
    };

    const handleUpvoteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpvote();
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    return (
        <Card
            sx={{
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 3,
                },
            }}
            onClick={onCardClick}
        >
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="h6" component="h3">
                                    {knowHow.title}
                                </Typography>
                                <Chip
                                    icon={knowHow.contentType === "markdown" ? <CodeIcon /> : <TextFieldsIcon />}
                                    label={knowHow.contentType === "markdown" ? "마크다운" : "텍스트"}
                                    size="small"
                                    variant="outlined"
                                />
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                작성자: {knowHow.owner ? knowHow.owner.split(':')[2] || '익명' : '익명'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {isEdited
                                    ? `${formatDate(updatedAt)} (편집됨)`
                                    : formatDate(createdAt)}
                            </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                            {isOwner && (
                                <IconButton
                                    onClick={handleEditClick}
                                    size="small"
                                    color="primary"
                                    aria-label="edit"
                                >
                                    <EditIcon />
                                </IconButton>
                            )}
                            <IconButton
                                onClick={handleUpvoteClick}
                                size="small"
                                color={isUpvoted ? "primary" : "default"}
                                aria-label="upvote"
                            >
                                {isUpvoted ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                            </IconButton>
                            <Chip label={upvoteCount} size="small" />
                        </Stack>
                    </Stack>

                    <Divider />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                        }}
                    >
                        {knowHow.content}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}
