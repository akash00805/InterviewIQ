# 🏗️ InterviewIQ Registration Architecture

## System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERVIEWIQ                                 │
│                  AI-Powered Interview Platform                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐       ┌──────────────────────┐
│    FRONTEND          │       │   BACKEND            │
│  (React + Vite)      │◄─────►│  (Node + Express)    │
│                      │ HTTP  │                      │
│  • Register Page     │       │  • Auth Routes       │
│  • Login Page        │       │  • User Routes       │
│  • Dashboard         │       │  • Validation Logic  │
│  • Protected Routes  │       │  • Password Hashing  │
│                      │       │  • Email Service     │
│  Redux Store:        │       │  • JWT Generation    │
│  • Auth State        │       │                      │
│  • User Data         │       │  Middleware:         │
│  • Loading Status    │       │  • Auth Middleware   │
│                      │       │  • CORS              │
│                      │       │  • Error Handler     │
└──────────────────────┘       └──────────────────────┘
         │                              │
         │                              │
         │                         ┌────▼──────────┐
         │                         │   MONGODB     │
         │                         │   DATABASE    │
         │                         │               │
         │                         │ Collections:  │
         └────────────────────────►│ • users       │
              Register Flow         │ • interviews  │
                                   │ • questions   │
                                   │ • answers     │
                                   │ • resumes     │
                                   │ • analytics   │
                                   │               │
                                   │ User Doc:     │
                                   │ • email       │
                                   │ • password    │
                                   │ • firstName   │
                                   │ • lastName    │
                                   │ • verified    │
                                   │ • createdAt   │
                                   └───────────────┘

                    ┌──────────────────┐
                    │   EMAIL SERVICE  │
                    │   (Nodemailer)   │
                    │                  │
                    │ • Verification   │
                    │ • Password Reset │
                    │ • Notifications  │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  EMAIL PROVIDER  │
                    │   (Gmail SMTP)   │
                    └──────────────────┘
```

---

## Registration Flow - Detailed

```
USER → FRONTEND → BACKEND → MONGODB → EMAIL → USER

Step 1: User Registration Form
┌──────────────────────────────────┐
│ Register Page (React Component)   │
│                                  │
│ Form Fields:                     │
│ • First Name                     │
│ • Last Name                      │
│ • Email                          │
│ • Username                       │
│ • Password (min 6 chars)         │
│ • Confirm Password               │
│                                  │
│ State: useAuth() Hook            │
│ • register() function            │
│ • loading state                  │
│ • error handling                 │
│                                  │
│ Success: setShowSuccess(true)    │
│ Modal: RegistrationSuccess       │
└───────────┬──────────────────────┘
            │
            │ handleSubmit()
            │ • Validate fields
            │ • Check passwords match
            │ • Check password length
            │
            ▼
Step 2: HTTP Request
┌──────────────────────────────────┐
│ POST /api/auth/register           │
│                                  │
│ Headers:                         │
│ • Content-Type: application/json │
│ • Accept: application/json       │
│                                  │
│ Body:                            │
│ {                                │
│   firstName: "John",             │
│   lastName: "Doe",               │
│   email: "john@example.com",     │
│   username: "johndoe123",        │
│   password: "SecurePass123",     │
│   confirmPassword: "SecurePass123"
│ }                                │
└───────────┬──────────────────────┘
            │
            │ Axios HTTP Client
            │ baseURL: http://localhost:5000
            │ withCredentials: true
            │
            ▼
Step 3: Backend Validation
┌──────────────────────────────────┐
│ auth.controller.register()        │
│                                  │
│ Checks:                          │
│ ✓ All fields provided            │
│ ✓ Passwords match                │
│ ✓ Email format valid             │
│ ✓ Email not already registered   │
│ ✓ Username not already registered │
│                                  │
│ If any check fails:              │
│ → 400 Bad Request                │
│ → Error message returned         │
│                                  │
│ If all checks pass:              │
│ → Continue to password hashing   │
└───────────┬──────────────────────┘
            │
            │ Password Hashing
            │ bcryptjs.hash(password, 10)
            │
            ▼
Step 4: Create User Document
┌──────────────────────────────────┐
│ Create User Object               │
│                                  │
│ new User({                       │
│   firstName: "John",             │
│   lastName: "Doe",               │
│   email: "john@example.com",     │
│   username: "johndoe123",        │
│   password: "$2a$10$...",        │
│   isEmailVerified: false,        │
│   emailVerificationToken: hash,  │
│   emailVerificationExpiry: +24h, │
│   createdAt: now(),              │
│   updatedAt: now()               │
│ })                               │
└───────────┬──────────────────────┘
            │
            │ user.save()
            │
            ▼
Step 5: Save to MongoDB
┌──────────────────────────────────┐
│ MongoDB Insert Operation         │
│                                  │
│ Database: interviewiq            │
│ Collection: users                │
│                                  │
│ Document Created:                │
│ {                                │
│   _id: ObjectId(...),            │
│   email: "john@example.com",     │
│   username: "johndoe123",        │
│   firstName: "John",             │
│   lastName: "Doe",               │
│   password: "$2a$10$...",        │
│   isEmailVerified: false,        │
│   emailVerificationToken: hash,  │
│   emailVerificationExpiry: Date, │
│   createdAt: Date,               │
│   updatedAt: Date                │
│ }                                │
│                                  │
│ ✅ USER SAVED TO DATABASE        │
└───────────┬──────────────────────┘
            │
            │ Verification Email
            │
            ▼
Step 6: Send Verification Email
┌──────────────────────────────────┐
│ Nodemailer Email Service         │
│                                  │
│ sendVerificationEmail()           │
│                                  │
│ To: john@example.com             │
│ Subject: Email Verification -    │
│          InterviewIQ             │
│                                  │
│ Body HTML:                       │
│ Click to verify:                 │
│ http://localhost:5173/           │
│   verify-email/[TOKEN]           │
│                                  │
│ Sent via: Gmail SMTP             │
│ ✅ EMAIL SENT                    │
└───────────┬──────────────────────┘
            │
            │ Success Response
            │
            ▼
Step 7: Send Response to Frontend
┌──────────────────────────────────┐
│ HTTP Response (201 Created)      │
│                                  │
│ {                                │
│   message: "User registered      │
│   successfully.",                │
│   user: {                        │
│     id: "...",                   │
│     email: "john@example.com",   │
│     username: "johndoe123",      │
│     firstName: "John",           │
│     lastName: "Doe"              │
│   }                              │
│ }                                │
│                                  │
│ ✅ NO SENSITIVE DATA RETURNED    │
└───────────┬──────────────────────┘
            │
            │ Response Received
            │ Dispatch Redux Actions
            │
            ▼
Step 8: Frontend Success State
┌──────────────────────────────────┐
│ Register.jsx Component           │
│                                  │
│ handleSubmit Success:            │
│ • setShowSuccess(true)           │
│ • Modal appears immediately      │
│                                  │
│ Redux Dispatch:                  │
│ • registerSuccess(user)          │
│ • Update auth state              │
│ • Set user data                  │
│                                  │
│ UI Changes:                      │
│ • Form hidden                    │
│ • Success modal visible          │
│ • 3-second countdown starts      │
└───────────┬──────────────────────┘
            │
            │ setTimeout(3000)
            │ navigate('/login')
            │
            ▼
Step 9: Registration Success Modal
┌──────────────────────────────────┐
│ RegistrationSuccess Component    │
│                                  │
│ ┌──────────────────────────────┐ │
│ │ RegistrationSuccessful! 🎉   │ │
│ │                              │ │
│ │ ✓ Check icon                 │ │
│ │ ✓ User saved to MongoDB      │ │
│ │ ✓ Verification email sent    │ │
│ │ ✓ Account ready for use      │ │
│ │                              │ │
│ │ Next: Check your email for   │ │
│ │       verification link      │ │
│ │                              │ │
│ │ [Continue to Login]          │ │
│ └──────────────────────────────┘ │
│                                  │
│ Modal Features:                  │
│ • Fixed overlay                  │
│ • CheckCircle icon (lucide-react)│
│ • Centered on screen             │
│ • Auto-redirects after 3 seconds │
└───────────┬──────────────────────┘
            │
            │ 3 seconds elapsed
            │
            ▼
Step 10: Redirect to Login
┌──────────────────────────────────┐
│ Navigate('/login')               │
│                                  │
│ User now at /login page          │
│ Ready to verify email and login  │
│                                  │
│ ✅ REGISTRATION COMPLETE         │
└──────────────────────────────────┘
```

---

## File Structure

```
InterviewIQ/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Register.jsx           ← Updated with RegistrationSuccess
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── components/
│   │   │   ├── RegistrationSuccess.jsx ← NEW! Success Modal
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   └── useAuth.js           ← Provides register() function
│   │   ├── services/
│   │   │   └── api.js               ← Axios HTTP client
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   └── authSlice.js
│   │   │   └── store.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js    ← register() saves to MongoDB
│   │   ├── models/
│   │   │   └── User.js               ← User schema for MongoDB
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── user.routes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── services/
│   │   │   └── email.service.js      ← Sends verification email
│   │   └── utils/
│   │       └── auth.js
│   ├── server.js                     ← Express app + MongoDB connection
│   ├── package.json
│   └── .env
│
├── REGISTRATION_GUIDE.md
├── REGISTRATION_QUICK_REFERENCE.md
├── MONGODB_REGISTRATION_FLOW.md
└── PROJECT_PLAN.md
```

---

## Data Flow Summary

```
User Input
    ↓
Register.jsx (Frontend)
    ↓
Validation (Client-side)
    ↓
Axios HTTP POST
    ↓
auth.controller.register() (Backend)
    ↓
Validation (Server-side)
    ↓
Password Hashing (bcryptjs)
    ↓
Create User Document
    ↓
user.save() → MongoDB ← STORAGE
    ↓
Send Verification Email
    ↓
Success Response
    ↓
Redux Dispatch
    ↓
RegistrationSuccess Modal
    ↓
Auto-redirect to /login
```

---

## Key Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI Components |
| Frontend | Vite | Build Tool |
| Frontend | Redux Toolkit | State Management |
| Frontend | React Router | Navigation |
| Frontend | Tailwind CSS | Styling |
| Frontend | Axios | HTTP Client |
| Backend | Node.js | Runtime |
| Backend | Express | Web Framework |
| Backend | Mongoose | MongoDB ODM |
| Backend | bcryptjs | Password Hashing |
| Database | MongoDB | Data Storage |
| Email | Nodemailer | Email Sending |
| Email | Gmail SMTP | Email Provider |

---

## Security Layers

```
Layer 1: Frontend Validation
✓ Required field checks
✓ Password length validation
✓ Password confirmation
✓ Client-side error handling

         ↓

Layer 2: HTTP Transport
✓ CORS enabled
✓ Content-Type validation
✓ Request/Response headers

         ↓

Layer 3: Backend Validation
✓ Re-validate all fields
✓ Check duplicates in database
✓ Sanitize inputs

         ↓

Layer 4: Password Security
✓ Hash with bcryptjs (salt: 10)
✓ Never store plaintext
✓ Use hashed password for comparison

         ↓

Layer 5: Token Security
✓ Generate random tokens
✓ Hash tokens before storage
✓ Set expiration times (24h)
✓ One-time use only

         ↓

Layer 6: Email Verification
✓ Required before login
✓ Link expires in 24 hours
✓ Cannot bypass verification

         ↓

Layer 7: Database Security
✓ Mongoose schema validation
✓ Indexed unique fields
✓ MongoDB authentication
```

---

## Testing Checklist

- [ ] Form validation works (missing fields)
- [ ] Password mismatch error shows
- [ ] Duplicate email error shows
- [ ] Duplicate username error shows
- [ ] Short password error shows
- [ ] Success modal appears
- [ ] Success modal shows checkmark icon
- [ ] Success modal shows correct messages
- [ ] Auto-redirect to login works
- [ ] User exists in MongoDB
- [ ] Password is hashed (not plaintext)
- [ ] Verification email received
- [ ] Email contains correct link
- [ ] Clicking link verifies email
- [ ] Can login after verification
- [ ] Dashboard loads after login

---

## Ready to Test! 🚀

All components are now integrated. Follow REGISTRATION_GUIDE.md to:

1. Set up MongoDB
2. Configure .env files
3. Start backend
4. Start frontend
5. Test registration flow
6. Verify MongoDB storage
7. Test email verification
8. Test login flow

**Status: ✅ REGISTRATION FEATURE COMPLETE**
