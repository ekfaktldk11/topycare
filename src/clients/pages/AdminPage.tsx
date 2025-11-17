import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    TextField,
    Typography,
    Alert,
    CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createDish } from "../api/data";

export default function AdminPage() {
    const [formData, setFormData] = useState({
        img: "",
        name: "",
        brand: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange =
        (field: keyof typeof formData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData({ ...formData, [field]: e.target.value });
            // 입력 시 메시지 초기화
            setSuccess(false);
            setError(null);
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 유효성 검사
        if (!formData.name.trim()) {
            setError("상품 이름을 입력해주세요.");
            return;
        }
        if (!formData.brand.trim()) {
            setError("브랜드를 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const result = await createDish(
                formData.img.trim(),
                formData.name.trim(),
                formData.brand.trim()
            );

            if (result.newDish) {
                setSuccess(true);
                setFormData({ img: "", name: "", brand: "" });
            } else {
                setError("상품 추가에 실패했습니다. 다시 시도해주세요.");
                console.error("Failed to create dish:", result.errors);
            }
        } catch (err) {
            setError("예상치 못한 오류가 발생했습니다.");
            console.error("Error creating dish:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({ img: "", name: "", brand: "" });
        setSuccess(false);
        setError(null);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Stack gap={3}>
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ fontWeight: 700 }}
                >
                    관리자 페이지
                </Typography>

                <Card>
                    <CardContent>
                        <Typography
                            variant="h6"
                            sx={{ mb: 3, fontWeight: 600 }}
                        >
                            새 상품 추가
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Stack gap={2.5}>
                                <TextField
                                    fullWidth
                                    label="이미지 URL"
                                    value={formData.img}
                                    onChange={handleChange("img")}
                                    placeholder="https://example.com/image.jpg"
                                    helperText="이미지 URL을 입력하세요 (선택사항)"
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
                                                    target.style.display =
                                                        "none";
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}

                                {/* 성공/에러 메시지 */}
                                {success && (
                                    <Alert severity="success">
                                        상품이 성공적으로 추가되었습니다!
                                    </Alert>
                                )}
                                {error && (
                                    <Alert severity="error">{error}</Alert>
                                )}

                                {/* 버튼 */}
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
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        초기화
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Container>
    );
}
