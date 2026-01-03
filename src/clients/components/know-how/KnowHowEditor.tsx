import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Typography,
    Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import CodeIcon from "@mui/icons-material/Code";
import { useState, useEffect } from "react";
import type { Schema } from "../../../../amplify/data/resource";

interface KnowHowEditorProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { title: string; content: string; contentType: "markdown" | "text" }) => void;
    editingKnowHow?: Schema["KnowHow"]["type"] | null;
}

export default function KnowHowEditor({
    open,
    onClose,
    onSubmit,
    editingKnowHow,
}: KnowHowEditorProps) {
    const [contentType, setContentType] = useState<"markdown" | "text">("text");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (editingKnowHow) {
            setTitle(editingKnowHow.title);
            setContent(editingKnowHow.content);
            setContentType((editingKnowHow.contentType as "markdown" | "text") || "text");
        } else {
            setTitle("");
            setContent("");
            setContentType("text");
        }
    }, [editingKnowHow, open]);

    const handleSubmit = () => {
        if (!title.trim() || !content.trim()) return;
        onSubmit({ title: title.trim(), content: content.trim(), contentType });
        handleClose();
    };

    const handleClose = () => {
        setTitle("");
        setContent("");
        setContentType("text");
        onClose();
    };

    const handleContentTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newType: "markdown" | "text" | null
    ) => {
        if (newType !== null) {
            setContentType(newType);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" fullScreen>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
                <Typography variant="h6">
                    {editingKnowHow ? "노하우 수정" : "새 노하우 작성"}
                </Typography>
                <IconButton onClick={handleClose} size="small" aria-label="close">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="body2" sx={{ minWidth: 80 }}>
                        문서 타입:
                    </Typography>
                    <ToggleButtonGroup
                        value={contentType}
                        exclusive
                        onChange={handleContentTypeChange}
                        disabled={!!editingKnowHow}
                        size="small"
                    >
                        <ToggleButton value="text" aria-label="text">
                            <TextFieldsIcon sx={{ mr: 1 }} />
                            일반 텍스트
                        </ToggleButton>
                        <ToggleButton value="markdown" aria-label="markdown">
                            <CodeIcon sx={{ mr: 1 }} />
                            마크다운
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>

                <TextField
                    label="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    required
                    autoFocus
                />

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <TextField
                        label="본문"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={20}
                        fullWidth
                        required
                        placeholder={
                            contentType === "markdown"
                                ? "마크다운 형식으로 작성하세요...\n\n⚠️ 법적 문제가 발생할 수 있는 인라인 이미지 링크는 사용이 제한됩니다."
                                : "노하우를 작성하세요..."
                        }
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={handleClose} color="inherit">
                    취소
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!title.trim() || !content.trim()}
                >
                    {editingKnowHow ? "수정" : "작성"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
