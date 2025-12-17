import {
    Box,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Stack,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadedImageList from "./UploadedImageList";

interface ImageUploadSectionProps {
    uploadedImages: string[];
    uploadLoading: boolean;
    uploadError: string | null;
    onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onCopyUrl: (url: string) => void;
    onDeleteImage: (index: number) => void;
    onUseImageUrl: (url: string) => void;
}

export default function ImageUploadSection({
    uploadedImages,
    uploadLoading,
    uploadError,
    onImageUpload,
    onCopyUrl,
    onDeleteImage,
    onUseImageUrl,
}: ImageUploadSectionProps) {
    return (
        <Stack gap={3}>
            <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    이미지 업로드
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                >
                    이미지를 업로드하면 자동으로 S3에 저장되고 URL이
                    생성됩니다.
                    <br />
                    최대 파일 크기: 5MB | 지원 형식: JPG, PNG, GIF, WebP
                </Typography>

                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploadLoading}
                >
                    {uploadLoading ? "업로드 중..." : "이미지 선택"}
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={onImageUpload}
                    />
                </Button>
            </Box>

            {uploadError && <Alert severity="error">{uploadError}</Alert>}

            {uploadLoading && (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                </Box>
            )}

            {uploadedImages.length > 0 && (
                <UploadedImageList
                    images={uploadedImages}
                    onCopyUrl={onCopyUrl}
                    onDeleteImage={onDeleteImage}
                    onUseImageUrl={onUseImageUrl}
                />
            )}
        </Stack>
    );
}