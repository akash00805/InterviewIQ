# InterviewIQ - AI-Powered Interview Preparation Platform

🚀 An intelligent mock interview platform powered by AI that helps users prepare for technical and HR interviews with personalized feedback.

## ✨ Features

### Phase 1: Authentication ✅
- User registration & login
- Email verification
- Password reset functionality
- JWT-based authentication

### Phase 2: AI Features (In Progress)
- Resume upload & parsing
- AI-generated interview questions
- Real-time answer evaluation
- Performance analytics
- Interview history tracking

### Phase 3: Advanced Features (Planned)
- Company-specific interview prep
- Voice interview with Web Speech API
- Behavioral analysis (eye contact, confidence, speaking speed)
- Personalized learning paths

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Redux, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| AI Service | FastAPI, Python |
| Database | MongoDB |
| AI Model | Google Gemini API |
| Voice | Web Speech API |

## 📋 Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MongoDB (v5.0+) or MongoDB Atlas account
- Google Gemini API key
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
cd InterviewIQ
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Setup AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Update .env with your configuration
python -m uvicorn app.main:app --reload
```

## 📚 Project Documentation

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Complete project plan and database design
- [Database Schema Design](./PROJECT_PLAN.md#database-design) - MongoDB collections
- [Development Phases](./PROJECT_PLAN.md#development-phases) - Phase breakdown

## 🔗 Folder Structure

```
InterviewIQ/
├── frontend/          # React application
├── backend/           # Node.js + Express server
├── ai-service/        # FastAPI Python service
└── .github/          # GitHub workflows
```

## 💡 Key Concepts

### User Flow
1. **Registration** → User creates account with email verification
2. **Resume Upload** → Upload resume for AI to understand background
3. **Interview Setup** → Choose company/role for interview prep
4. **Questions** → AI generates personalized questions
5. **Answer & Evaluation** → Submit answer, get AI feedback
6. **Analytics** → Track progress and improvement areas

### AI Integration
- **Question Generation**: Gemini API generates questions based on resume & target company
- **Answer Evaluation**: AI evaluates responses on relevance, clarity, completeness
- **Behavioral Analysis**: (Phase 3) Analyze confidence, speed, and non-verbal cues

## 🤝 Contributing

Contributions are welcome! Please feel free to submit PRs.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Status**: Currently in Phase 1 - Authentication Setup
