# InterviewIQ - Setup Instructions

## Prerequisites

Before you start, make sure you have installed:
- **Node.js** (v18+): [https://nodejs.org/](https://nodejs.org/)
- **Python** (v3.9+): [https://www.python.org/](https://www.python.org/)
- **MongoDB**: Either locally or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Environment Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# Windows: Download and install MongoDB from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow instructions at https://docs.mongodb.com/manual/installation/

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` files with your connection string

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A random secret key
# - MAIL_USER, MAIL_PASS: Gmail credentials (for email verification)
# - GEMINI_API_KEY: Your Google Gemini API key

# Start development server
npm run dev
```

Backend will run on: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### 4. AI Service Setup

```bash
cd ai-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your configuration

# Start FastAPI server
python -m uvicorn app.main:app --reload
```

AI Service will run on: **http://localhost:8000**

---

## API Setup

### Getting Gmail Credentials

1. Enable 2-factor authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this password in your `.env` file as `MAIL_PASS`

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key to your `.env` files

---

## Testing the Application

### 1. Verify All Services are Running

- Backend: `http://localhost:5000/api/health`
- Frontend: `http://localhost:5173`
- AI Service: `http://localhost:8000/health`

### 2. Test Registration Flow

1. Go to `http://localhost:5173/register`
2. Fill in the registration form
3. Check your email for verification link
4. Click verification link
5. Go to login page and login

### 3. Test Forgot Password Flow

1. Go to `http://localhost:5173/forgot-password`
2. Enter your email
3. Check email for reset link
4. Click link and reset password

---

## Phase 1 - Authentication Implementation

✅ **Completed:**
- User Registration with email verification
- User Login with JWT authentication
- Forgot Password & Password Reset
- Protected Routes
- User Profile Management

**Files:**
- Backend: `backend/src/controllers/auth.controller.js`
- Backend: `backend/src/routes/auth.routes.js`
- Frontend: `frontend/src/pages/Register.jsx`, `Login.jsx`, `ForgotPassword.jsx`

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- For MongoDB Atlas, ensure IP is whitelisted

### Email Not Sending
- Check Gmail credentials in `.env`
- Ensure 2FA is enabled and app password is used
- Check spam folder

### CORS Errors
- Ensure `FRONTEND_URL` matches your frontend URL
- Backend CORS is configured for frontend origin

### Port Already in Use
- Backend (5000): `lsof -i :5000` then `kill -9 <PID>`
- Frontend (5173): `lsof -i :5173` then `kill -9 <PID>`
- AI Service (8000): `lsof -i :8000` then `kill -9 <PID>`

---

## Next Steps

After completing Phase 1:
1. Test all authentication flows
2. Prepare for Phase 2: AI Features
3. Set up resume parsing
4. Integrate Gemini API for question generation

---

## Project Structure Reference

```
InterviewIQ/
├── backend/              # Express.js + MongoDB
│   ├── src/
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Auth middleware
│   │   └── services/    # Business logic
│   └── server.js
│
├── frontend/            # React + Redux
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   ├── redux/      # Redux state
│   │   ├── hooks/      # Custom hooks
│   │   ├── services/   # API services
│   │   └── styles/     # CSS files
│   └── index.html
│
├── ai-service/         # FastAPI + Python
│   ├── app/
│   │   ├── main.py     # FastAPI app
│   │   ├── models/     # Pydantic models
│   │   └── services/   # AI logic
│   └── requirements.txt
│
└── PROJECT_PLAN.md     # Detailed plan
```

---

## Support

For issues:
1. Check the troubleshooting section
2. Review error messages in console
3. Ensure all prerequisites are installed
4. Verify `.env` files are correctly configured

Good luck! 🚀
