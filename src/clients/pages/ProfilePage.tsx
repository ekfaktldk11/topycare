import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Avatar,
    TextField,
    Button,
    Divider,
    Paper,
    Grid,
    CircularProgress,
    Alert,
} from "@mui/material";
import { signOut } from "aws-amplify/auth";
import type { FetchUserAttributesOutput } from "aws-amplify/auth";
import { getUserAttributes } from "../api/auth";

export default function ProfilePage() {
    const [userAttributes, setUserAttributes] =
        useState<FetchUserAttributesOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    // 편집 가능한 다른 정보가 있다면 별도의 state로 관리
    // const [editableInfo, setEditableInfo] = useState({ bio: "" });

    useEffect(() => {
        const fetchAttributes = async () => {
            setIsLoading(true);
            try {
                const attributes = await getUserAttributes();
                setUserAttributes(attributes);
                // setEditableInfo({ bio: attributes.bio || "" }); // 예시
            } catch (err) {
                setError("사용자 정보를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttributes();
    }, []);

    if (isLoading) {
        return (
            <Container
                maxWidth="md"
                sx={{ mt: 4, display: "flex", justifyContent: "center" }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                {/* Header Section */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                        sx={{ width: 100, height: 100, mr: 3 }}
                        src={userAttributes?.picture} // Cognito에 picture 속성이 있다면 사용
                        alt={userAttributes?.name}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            {userAttributes?.name ?? "사용자"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userAttributes?.email}
                        </Typography>
                    </Box>
                    {/* 편집 가능한 필드가 있을 때만 편집/저장 버튼을 보여줍니다. */}
                    {/*
                    <IconButton onClick={isEditing ? handleSave : handleEdit} color="primary">
                        {isEditing ? <SaveIcon /> : <EditIcon />}
                    </IconButton>
                    */}
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* User Information Section */}
                <Typography variant="h6" gutterBottom>
                    개인 정보
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="이름"
                            value={userAttributes?.name ?? ""}
                            disabled // 항상 비활성화
                            variant="outlined"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="이메일"
                            value={userAttributes?.email ?? ""}
                            disabled // 항상 비활성화
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* User Activity Section */}
                <Typography variant="h6" gutterBottom>
                    활동
                </Typography>
                <Grid container spacing={2}>
                    <div>🚧</div>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Account Settings Section */}
                <Typography variant="h6" gutterBottom>
                    계정 설정
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Button variant="outlined" color="primary" fullWidth>
                        비밀번호 변경
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        fullWidth
                        onClick={() => signOut()}
                    >
                        로그 아웃
                    </Button>
                    <Button variant="outlined" color="error" fullWidth>
                        계정 삭제
                    </Button>
                    {/*<Button variant="outlined" color="secondary" fullWidth>
						알림 설정
					</Button>*/}
                </Box>
            </Paper>
        </Container>
    );
}
