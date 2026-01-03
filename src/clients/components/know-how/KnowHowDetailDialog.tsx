import { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    Box,
    Chip,
    Stack,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CodeIcon from "@mui/icons-material/Code";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import type { Schema } from "../../../../amplify/data/resource";

interface KnowHowDetailDialogProps {
    open: boolean;
    knowHow: Schema["KnowHow"]["type"] | null;
    onClose: () => void;
}

export default function KnowHowDetailDialog({
    open,
    knowHow,
    onClose,
}: KnowHowDetailDialogProps) {
    const [authorDisplayName, setAuthorDisplayName] = useState("");

    useEffect(() => {
        if (!knowHow) return;
        
        const loadAuthor = async () => {
            try {
                const author = await knowHow.author();
                let nickname = author?.data?.nickname ?? "알수없음";

                if (nickname) {
                    setAuthorDisplayName(nickname);
                }
            } catch (error) {
                console.error("Failed to load author", error);
                setAuthorDisplayName("알수없음");
            }
        };
        loadAuthor();
    }, [knowHow]);

    if (!knowHow) return null;

    const createdAt = new Date(knowHow.createdAt);
    const updatedAt = new Date(knowHow.updatedAt);
    const isEdited = updatedAt.getTime() - createdAt.getTime() > 1000;

    const formatDate = (date: Date) => {
        return format(date, "yyyy년 MM월 dd일 HH:mm", { locale: ko });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h6">{knowHow.title}</Typography>
                    <Chip
                        icon={knowHow.contentType === "markdown" ? <CodeIcon /> : <TextFieldsIcon />}
                        label={knowHow.contentType === "markdown" ? "마크다운" : "텍스트"}
                        size="small"
                        variant="outlined"
                    />
                </Stack>
                <IconButton onClick={onClose} size="small" aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            작성자: {authorDisplayName || "알수없음"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {isEdited
                                ? `${formatDate(updatedAt)} (편집됨)`
                                : formatDate(createdAt)}
                        </Typography>
                    </Box>

                    <Divider />

                    <Box sx={{ mt: 2 }}>
                        {knowHow.contentType === "markdown" ? (
                            <ReactMarkdown
                                components={{
                                    // 인라인 이미지 제거
                                    img: () => null,
                                }}
                            >
                                {knowHow.content}
                            </ReactMarkdown>
                        ) : (
                            <Typography
                                variant="body1"
                                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                            >
                                {knowHow.content}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}
