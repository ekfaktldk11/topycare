import React, { useState } from "react";
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
	IconButton,
} from "@mui/material";
import { Edit as EditIcon, Save as SaveIcon } from "@mui/icons-material";
import { signOut } from "aws-amplify/auth";

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [userInfo, setUserInfo] = useState({
		name: "김토피",
		email: "topy@example.com",
		phone: "010-1234-5678",
		bio: "건강한 식습관을 추구하는 사용자입니다.",
	});

	const handleEdit = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = () => {
		setIsEditing(false);
		// TODO: 서버에 사용자 정보 저장 로직 추가
		console.log("User info saved:", userInfo);
	};

	const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserInfo({ ...userInfo, [field]: event.target.value });
	};

	return (
		<Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				{/* Header Section */}
				<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
					<Avatar
						sx={{ width: 100, height: 100, mr: 3 }}
						src="/path-to-profile-image.jpg"
						alt="Profile Picture"
					/>
					<Box sx={{ flexGrow: 1 }}>
						<Typography variant="h4" gutterBottom>
							{userInfo.name}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{userInfo.email}
						</Typography>
					</Box>
					<IconButton onClick={isEditing ? handleSave : handleEdit} color="primary">
						{isEditing ? <SaveIcon /> : <EditIcon />}
					</IconButton>
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
							value={userInfo.name}
							onChange={handleChange("name")}
							disabled={!isEditing}
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label="이메일"
							value={userInfo.email}
							onChange={handleChange("email")}
							disabled={!isEditing}
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12, sm: 6 }}>
						<TextField
							fullWidth
							label="전화번호"
							value={userInfo.phone}
							onChange={handleChange("phone")}
							disabled={!isEditing}
							variant="outlined"
						/>
					</Grid>
					<Grid size={{ xs: 12 }}>
						<TextField
							fullWidth
							label="소개"
							value={userInfo.bio}
							onChange={handleChange("bio")}
							disabled={!isEditing}
							variant="outlined"
							multiline
							rows={3}
						/>
					</Grid>
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
					<Button variant="outlined" color="secondary" fullWidth onClick={() => signOut()}>
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