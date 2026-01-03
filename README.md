# 🏥 Topycare

건강 관리를 위한 제품 리뷰 및 노하우 공유 플랫폼

## 📋 프로젝트 소개

Topycare는 건강 관련 제품(식품, 보조제 등)에 대한 사용자 피드백과 건강 관리 노하우를 공유할 수 있는 커뮤니티 플랫폼입니다.

### 주요 기능

- 🍎 **제품 타임라인**: 아토피에 어떤 영향을 끼치는 지, 제품 목록 조회 및 필터링
- ⭐ **피드백 시스템**: 제품에 대한 평점 및 리뷰 작성
- 📝 **노하우 공유**: 마크다운 기반 건강 관리 팁 작성 및 공유
- 👍 **좋아요 시스템**: 피드백 및 노하우에 대한 추천 기능
- 🔐 **인증 시스템**: AWS Cognito 기반 회원가입/로그인
- 👨‍💼 **관리자 페이지**: 제품 추가 및 이미지 관리

## 🛠️ 기술 스택

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Material-UI (MUI)** - UI 컴포넌트 라이브러리
- **React Router** - 라우팅
- **React Markdown** - 마크다운 렌더링

### Backend (AWS Amplify Gen 2)
- **AWS Amplify** - 백엔드 인프라
- **Amazon Cognito** - 사용자 인증
- **AWS AppSync** - GraphQL API
- **Amazon DynamoDB** - 데이터베이스
- **Amazon S3** - 이미지 스토리지

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- AWS 계정 (배포용)

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/yourusername/topycare.git
cd topycare

# 의존성 설치
npm install

# Amplify 백엔드 설정 (최초 1회)
npx ampx sandbox

# 개발 서버 실행
npm run dev
```

개발 서버는 `http://localhost:5173`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 프로덕션 배포

```bash
# Amplify 백엔드 배포
npx ampx deploy

# 호스팅 옵션:
# 1. AWS Amplify Hosting (권장)
# 2. Netlify, Vercel 등 정적 호스팅
# 3. S3 + CloudFront

# AWS Amplify Hosting을 사용하는 경우:
# - Amplify Console에서 앱 연결
# - Git 저장소 연동
# - 자동 빌드 및 배포 설정
```

## 📁 프로젝트 구조

```
src/
├── clients/
│   ├── api/           # API 호출 함수들
│   ├── components/    # React 컴포넌트들
│   │   ├── admin/     # 관리자 전용 컴포넌트
│   │   ├── feedback/  # 피드백 관련 컴포넌트
│   │   └── know-how/  # 노하우 관련 컴포넌트
│   ├── context/       # React Context (인증 등)
│   ├── pages/         # 페이지 컴포넌트들
│   ├── types/         # TypeScript 타입 정의
│   └── utils/         # 유틸리티 함수들
├── App.tsx            # 앱 루트 컴포넌트
└── main.tsx           # 엔트리 포인트

amplify/
├── auth/              # Cognito 설정
├── data/              # GraphQL 스키마 및 데이터 모델
└── storage/           # S3 스토리지 설정
```

## 🔑 주요 페이지

- `/` - 제품 타임라인 (메인)
- `/dish` - 제품 목록
- `/knowhow` - 노하우 페이지
- `/login` - 로그인/회원가입
- `/profile` - 프로필 (인증 필요)
- `/admin` - 관리자 페이지 (관리자 권한 필요)

## 👥 권한 시스템

- **Guest**: 제품 및 노하우 조회만 가능
- **Authenticated**: 피드백 및 노하우 작성, 좋아요 가능
- **Admin**: 제품 추가 및 관리 가능

## 📝 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💖 만든 사람

Made with ❤️ for 진도리

---

**Version**: 1.0.0
