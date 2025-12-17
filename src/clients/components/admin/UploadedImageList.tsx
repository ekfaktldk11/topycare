import { Box, Card, IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";

interface UploadedImageListProps {
    images: string[];
    onCopyUrl: (url: string) => void;
    onDeleteImage: (index: number) => void;
    onUseImageUrl: (url: string) => void;
}

export default function UploadedImageList({
    images,
    onCopyUrl,
    onDeleteImage,
    onUseImageUrl,
}: UploadedImageListProps) {
    return (
        <Box>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                업로드된 이미지 ({images.length})
            </Typography>
            <Stack gap={2}>
                {images.map((url, index) => (
                    <Card key={index} variant="outlined" sx={{ p: 2 }}>
                        <Stack
                            direction="row"
                            gap={2}
                            alignItems="center"
                        >
                            {/* 썸네일 */}
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 1,
                                    overflow: "hidden",
                                    bgcolor: "action.hover",
                                    flexShrink: 0,
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`업로드 ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>

                            {/* URL 표시 */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        wordBreak: "break-all",
                                        fontSize: "0.75rem",
                                        color: "text.secondary",
                                    }}
                                >
                                    {url}
                                </Typography>
                            </Box>

                            {/* 액션 버튼 */}
                            <Stack direction="row" gap={0.5}>
                                <IconButton
                                    size="small"
                                    onClick={() => onUseImageUrl(url)}
                                    title="상품 추가에 사용"
                                    color="primary"
                                >
                                    <AddIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => onCopyUrl(url)}
                                    title="URL 복사"
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    onClick={() => onDeleteImage(index)}
                                    title="목록에서 삭제"
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}