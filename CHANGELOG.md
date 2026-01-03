# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-03

### Added
- Initial release of Topycare
- Product timeline with filtering and sorting
- Feedback system with ratings and reviews
- Know-how sharing with Markdown support
- Upvote system for feedbacks and know-hows
- AWS Cognito authentication
- Admin panel for product and image management
- Responsive UI with Material-UI components

### Features
- 🍎 Product browsing and filtering
- ⭐ Rating and review system (1-5 stars)
- 📝 Markdown-based know-how articles
- 👍 Upvote/like functionality
- 🔐 User authentication and authorization
- 👨‍💼 Admin-only product management
- 📱 Mobile-responsive design
- 🖼️ Image upload to S3 storage

### Technical Stack
- Frontend: React 19, TypeScript, Vite, Material-UI
- Backend: AWS Amplify Gen 2, Cognito, AppSync, DynamoDB, S3
- Build: Vite with optimized production bundle

### Improvements in v1.0.0
- Replaced all `alert()` calls with Snackbar notifications
- Added comprehensive README documentation
- Added proper metadata to index.html
- Created .env.example for configuration reference
- Set version to 1.0.0

[1.0.0]: https://github.com/yourusername/topycare/releases/tag/v1.0.0
