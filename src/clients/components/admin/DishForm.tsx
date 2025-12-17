import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface DishFormProps {
    formData: {
        img: string;
        name: string;
        brand: string;
    };
    loading: boolean;
    success: boolean;
    error: string | null;
    onFormChange: (field: string, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onReset: () => void;
}

export default function DishForm({
    formData,
    loading,
    success,
    error,
    onFormChange,
    onSubmit,
    onReset,
}: DishFormProps) {
    const handleChange =
        (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            onFormChange(field, e.target.value);
        };

    return (
        <Box component="form" onSubmit={onSubmit}>
            <Stack gap={2.5}>
                <TextField
                    fullWidth
                    label="이미지 URL"
                    value={formData.img}
                    onChange={handleChange("img")}
                    placeholder="https://example.com/image.jpg"
                    helperText="이미지 URL을 입력하거나 '이미지 업로드' 탭에서 업로드하세요"
                />

                <TextField
                    fullWidth
                    required
                    label="상품 이름"
                    value={formData.name}
                    onChange={handleChange("name")}
                    placeholder="예) 신라면"
                />

                <TextField
                    fullWidth
                    required
                    label="브랜드"
                    value={formData.brand}
                    onChange={handleChange("brand")}
                    placeholder="예) 농심"
                />

                {/* 미리보기 */}
                {formData.img && (
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mb: 1, display: "block" }}
                        >
                            이미지 미리보기
                        </Typography>
                        <Box
                            sx={{
                                width: 200,
                                height: 200,
                                borderRadius: 1,
                                overflow: "hidden",
                                bgcolor: "action.hover",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img
                                src={formData.img}
                                alt="미리보기"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                                onError={(e) => {
                                    const target =
                                        e.currentTarget as HTMLImageElement;
                                    target.style.display = "none";
                                }}
                            />
                        </Box>
                    </Box>
                )}

                {success && (
                    <Alert severity="success">
                        상품이 성공적으로 추가되었습니다!
                    </Alert>
                )}
                {error && <Alert severity="error">{error}</Alert>}

                <Stack direction="row" gap={1.5}>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        startIcon={
                            loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <AddIcon />
                            )
                        }
                    >
                        {loading ? "추가 중..." : "상품 추가"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onReset}
                        disabled={loading}
                    >
                        초기화
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}