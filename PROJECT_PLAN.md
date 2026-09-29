# InterviewIQ - AI-Powered Interview Preparation Platform

## Project Overview
An AI-driven mock interview platform that generates personalized technical and HR interview questions from uploaded resumes, with AI-based answer evaluation and performance analytics.

**Tech Stack:**
- **Frontend:** React.js, Redux, Tailwind CSS
- **Backend:** Node.js, Express.js
- **AI Service:** FastAPI, Python
- **Database:** MongoDB
- **AI Model:** Google Gemini API
- **Additional:** Web Speech API for voice interviews

---

## Development Phases

### Phase 1: User Authentication ✅ (CURRENT)
**Duration:** Weeks 1-2
- User Registration
- User Login
- Password Reset/Forgot Password
- JWT Authentication
- Email Verification
- Input Validation & Error Handling

**Deliverables:**
- Authentication endpoints
- Auth middleware
- User model & schema
- Frontend auth pages

---

### Phase 2: AI Features 🔄 (UPCOMING)
**Duration:** Weeks 3-5
- Resume Upload & Parsing
- AI Question Generation (using Gemini API)
- AI Answer Evaluation
- Performance Analytics Dashboard
- Interview History

**Features:**
- Resume parsing from PDF/DOCX
- Generate technical & HR questions
- Real-time answer evaluation
- Score tracking

---

### Phase 3: Advanced Features 🚀 (FUTURE)
**Duration:** Weeks 6-8
- Company-Specific Interviews
  - Google DSA Questions
  - Amazon Leadership Questions
  - Meta Culture Questions
- Voice Interview with Web Speech API
- Behavioral Analysis
  - Eye contact detection
  - Speaking speed analysis
  - Confidence scoring
  - Tone analysis

---

## Database Design

### Collections:

#### 1. **users**
```
{
  _id: ObjectId
  email: string (unique, indexed)
  username: string (unique, indexed)
  password: string (hashed)
  firstName: string
  lastName: string
  phoneNumber: string
  profilePicture: string (URL)
  resume: {
    url: string
    uploadedAt: Date
    fileName: string
  }
  isEmailVerified: boolean
  emailVerificationToken: string
  emailVerificationExpiry: Date
  resetPasswordToken: string
  resetPasswordTokenExpiry: Date
  preferredRole: string
  targetCompanies: [string]
  createdAt: Date
  updatedAt: Date
}
```

#### 2. **interviews**
```
{
  _id: ObjectId
  userId: ObjectId (ref: users)
  title: string
  type: enum ['general', 'company-specific', 'dsa', 'behavioral']
  company: string (optional)
  status: enum ['in-progress', 'completed', 'paused']
  startedAt: Date
  completedAt: Date
  overallScore: number (0-100)
  questionCount: number
  answers: [ObjectId] (ref: answers)
  createdAt: Date
  updatedAt: Date
}
```

#### 3. **questions**
```
{
  _id: ObjectId
  interviewId: ObjectId (ref: interviews)
  userId: ObjectId (ref: users)
  text: string
  category: enum ['technical', 'hr', 'behavioral', 'dsa']
  company: string (optional)
  difficulty: enum ['easy', 'medium', 'hard']
  generatedAt: Date
  createdAt: Date
}
```

#### 4. **answers**
```
{
  _id: ObjectId
  questionId: ObjectId (ref: questions)
  interviewId: ObjectId (ref: interviews)
  userId: ObjectId (ref: users)
  answerText: string
  answerAudio: {
    url: string
    duration: number (seconds)
  }
  score: number (0-100)
  feedback: string
  evaluation: {
    strengths: [string]
    improvements: [string]
    keyPoints: [string]
    relevance: number (0-100)
    clarity: number (0-100)
    confidence: number (0-100) (optional - for voice)
    speakingSpeed: number (optional - for voice)
    eyeContact: number (optional - for voice, future)
  }
  submittedAt: Date
  evaluatedAt: Date
  createdAt: Date
}
```

#### 5. **resumes**
```
{
  _id: ObjectId
  userId: ObjectId (ref: users)
  fileName: string
  fileUrl: string
  parsedContent: {
    skills: [string]
    experience: [string]
    education: [string]
    projects: [string]
    summary: string
  }
  uploadedAt: Date
  createdAt: Date
}
```

#### 6. **analytics**
```
{
  _id: ObjectId
  userId: ObjectId (ref: users)
  totalInterviews: number
  completedInterviews: number
  averageScore: number
  categoryScores: {
    technical: number
    hr: number
    behavioral: number
    dsa: number
  }
  companySpecificScores: {
    google: number
    amazon: number
    meta: number
    microsoft: number
  }
  lastUpdated: Date
  createdAt: Date
}
```

---

## Project Structure

```
InterviewIQ/
├── frontend/                 # React.js App
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Tailwind CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── config/         # Configuration files
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── ai-service/              # FastAPI + Python
│   ├── app/
│   │   ├── main.py         # FastAPI app
│   │   ├── models/         # Pydantic models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # AI logic
│   │   └── utils/          # Utilities
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── .github/
│   └── workflows/          # CI/CD pipelines
│
├── PROJECT_PLAN.md         # This file
├── README.md               # Setup & documentation
└── docker-compose.yml      # Docker setup
```

---

## Environment Variables

### Backend (.env)
```
DATABASE_URL=mongodb://localhost:27017/interviewiq
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
GEMINI_API_KEY=your_gemini_api_key
MAIL_SERVICE=gmail
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
NODE_ENV=development
PORT=5000
```

### AI Service (.env)
```
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=mongodb://localhost:27017/interviewiq
BACKEND_URL=http://localhost:5000
```

---

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

---

## API Endpoints (Phase 1)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/logout` - Logout user

---

## Next Steps
1. Set up MongoDB locally or MongoDB Atlas
2. Initialize backend and frontend projects
3. Create user authentication system (Phase 1)
4. Set up CI/CD pipelines
5. Deploy on suitable platforms
