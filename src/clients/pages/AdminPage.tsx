import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Container,
    Stack,
    Typography,
    Tabs,
    Tab,
} from "@mui/material";
import { createDish } from "../api/data";
import { uploadImage } from "../api/storage";
import TabPanel from "../components/admin/TabPanel";
import DishForm from "../components/admin/DishForm";
import ImageUploadSection from "../components/admin/ImageUploadSection";

export default function AdminPage() {
    const [tabValue, setTabValue] = useState(0);

    // 상품 추가 폼 상태
    const [formData, setFormData] = useState({
        img: "",
        name: "",
        brand: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 이미지 업로드 상태
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setTabValue(newValue);
        setSuccess(false);
        setError(null);
        setUploadError(null);
    };

    const handleFormChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        setSuccess(false);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadLoading(true);
        setUploadError(null);

        try {
            const file = files[0];

            if (file.size > 5 * 1024 * 1024) {
                setUploadError("파일 크기는 5MB를 초과할 수 없습니다.");
                setUploadLoading(false);
                return;
            }

            if (!file.type.startsWith("image/")) {
                setUploadError("이미지 파일만 업로드할 수 있습니다.");
                setUploadLoading(false);
                return;
            }

            const result = await uploadImage(file, "public/dishes/");

            if (result.url) {
                setUploadedImages([...uploadedImages, result.url]);
            } else if (result.error) {
                setUploadError(result.error);
            }
        } catch (err) {
            setUploadError("이미지 업로드 중 오류가 발생했습니다.");
            console.error("Error uploading image:", err);
        } finally {
            setUploadLoading(false);
            e.target.value = "";
        }
    };

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url);
        alert("URL이 클립보드에 복사되었습니다!");
    };

    const handleDeleteImage = (index: number) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const handleUseImageUrl = (url: string) => {
        setFormData({ ...formData, img: url });
        setTabValue(0);
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
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            aria-label="admin tabs"
                        >
                            <Tab label="상품 추가" />
                            <Tab label="이미지 업로드" />
                        </Tabs>
                    </Box>

                    {/* 상품 추가 탭 */}
                    <TabPanel value={tabValue} index={0}>
                        <CardContent>
                            <DishForm
                                formData={formData}
                                loading={loading}
                                success={success}
                                error={error}
                                onFormChange={handleFormChange}
                                onSubmit={handleSubmit}
                                onReset={handleReset}
                            />
                        </CardContent>
                    </TabPanel>

                    {/* 이미지 업로드 탭 */}
                    <TabPanel value={tabValue} index={1}>
                        <CardContent>
                            <ImageUploadSection
                                uploadedImages={uploadedImages}
                                uploadLoading={uploadLoading}
                                uploadError={uploadError}
                                onImageUpload={handleImageUpload}
                                onCopyUrl={handleCopyUrl}
                                onDeleteImage={handleDeleteImage}
                                onUseImageUrl={handleUseImageUrl}
                            />
                        </CardContent>
                    </TabPanel>
                </Card>
            </Stack>
        </Container>
    );
}