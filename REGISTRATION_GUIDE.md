# InterviewIQ - Complete Registration & MongoDB Setup Guide

## ✅ What's Already Built

### Backend (Saves to MongoDB)
- ✅ User model with schema
- ✅ Registration endpoint (`POST /api/auth/register`)
- ✅ Password hashing with bcrypt
- ✅ Email verification token generation
- ✅ Email sending via Nodemailer
- ✅ Validation and error handling

### Frontend (Shows Success)
- ✅ Register form with validation
- ✅ Success message display (green banner)
- ✅ Error message display (red banner)
- ✅ Auto-redirect to login after 2 seconds
- ✅ Redux state management

---

## 🚀 Complete Setup Steps

### Step 1: MongoDB Setup

**Option A: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/interviewiq?retryWrites=true&w=majority
   ```
5. Replace `username` and `password` with your credentials

**Option B: MongoDB Local**
1. Download and install from https://www.mongodb.com/try/download/community
2. Start MongoDB:
   ```bash
   mongod
   ```
3. Connection string:
   ```
   mongodb://localhost:27017/interviewiq
   ```

---

### Step 2: Backend Environment Setup

1. Create `.env` file in `backend/` folder:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env` and fill in:
   ```
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interviewiq?retryWrites=true&w=majority
   
   # JWT
   JWT_SECRET=your_super_secret_key_min_32_chars_long_change_in_production
   JWT_EXPIRY=7d
   
   # Email (Gmail)
   MAIL_SERVICE=gmail
   MAIL_USER=your_gmail@gmail.com
   MAIL_PASS=your_app_specific_password
   
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   
   # Server
   NODE_ENV=development
   PORT=5000
   ```

**How to get Gmail App Password:**
1. Enable 2-factor authentication on your Gmail account
2. Go to https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Generate app password
5. Copy and paste as `MAIL_PASS`

---

### Step 3: Backend Install & Run

```bash
cd backend
npm install
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected
```

---

### Step 4: Frontend Setup

```bash
cd frontend
npm install
```

No .env needed for basic registration testing (uses default `http://localhost:5000/api`)

---

### Step 5: Frontend Run

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🧪 Test Registration Flow

### Step 1: Open Frontend
- Go to http://localhost:5173 in browser
- You should see login page
- Click "Register" link

### Step 2: Fill Registration Form
```
First Name:    John
Last Name:     Doe
Email:         test@example.com
Username:      johndoe123
Password:      Password123
Confirm Pass:  Password123
```

### Step 3: Submit Form
- Click "Register" button
- **Success message should appear:**
  ```
  ✓ Registration successful! Please check your email to verify your account.
  ```
- You'll be redirected to login page after 2 seconds

### Step 4: Check MongoDB
MongoDB now stores your user:
```json
{
  "_id": ObjectId("..."),
  "email": "test@example.com",
  "username": "johndoe123",
  "firstName": "John",
  "lastName": "Doe",
  "password": "$2a$10$...", // hashed
  "isEmailVerified": false,
  "emailVerificationToken": "...",
  "emailVerificationExpiry": ISODate("2026-06-11..."),
  "createdAt": ISODate("2026-06-10..."),
  "updatedAt": ISODate("2026-06-10...")
}
```

### Step 5: Check Email
- Check your email (Gmail, Outlook, etc.)
- Click verification link in email
- Should see: "Email verified successfully!"
- Now you can log in

---

## 🔍 Verify Data in MongoDB

### Using MongoDB Atlas UI
1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Click "Collections"
4. Select database `interviewiq`
5. Click collection `users`
6. See your registered user data

### Using MongoDB Compass (Desktop App)
1. Download from https://www.mongodb.com/products/compass
2. Connect with your connection string
3. Browse to `interviewiq` database
4. Click `users` collection
5. See all registered users

---

## ❌ Troubleshooting

### Backend won't start
```
MongoDB Connection Error: connect ECONNREFUSED
```
**Fix:** Ensure MongoDB is running
- If local: Open new terminal and run `mongod`
- If Atlas: Check connection string in .env

### Email not sending
```
Error: Invalid login: 535-5.7.8 Username and password not accepted
```
**Fix:**
- Ensure Gmail 2FA is enabled
- Use app-specific password (not Gmail password)
- Check `MAIL_USER` and `MAIL_PASS` in .env

### CORS error in frontend
```
Cross-Origin Request Blocked
```
**Fix:** Backend CORS is already enabled, make sure:
- Backend is running on `http://localhost:5000`
- Frontend is running on `http://localhost:5173`

### Can't login after registration
```
Error: Please verify your email before logging in
```
**Fix:**
- Check your email for verification link
- Click the link to verify
- Then login

---

## 📝 What Happens on Registration

```
User fills form
        ↓
Frontend validates (all fields, password match, min 6 chars)
        ↓
Sends POST to /api/auth/register
        ↓
Backend validates again
        ↓
Checks if email/username already exists
        ↓
Hashes password with bcrypt
        ↓
Generates email verification token
        ↓
Creates user document in MongoDB
        ↓
Sends verification email
        ↓
Returns success response to frontend
        ↓
Frontend shows success message
        ↓
Redirects to login after 2 seconds
```

---

## 📊 Registration Success Indicators

✅ **Frontend:** Green banner: "Registration successful! Please check your email to verify your account."
✅ **Backend Console:** No errors, shows user creation logs
✅ **MongoDB:** New user document appears in `users` collection
✅ **Email:** Verification email arrives in inbox

---

## 🎯 Next Steps After Registration

1. **Verify Email** → Click link in email
2. **Login** → Use email and password
3. **Dashboard** → See user profile and next steps
4. **Phase 2** → Upload resume, generate AI questions

---

## 🆘 Quick Support

| Issue | Solution |
|-------|----------|
| MongoDB not connecting | Check MONGODB_URI in .env |
| Email not sending | Verify Gmail app password |
| Frontend can't reach backend | Check FRONTEND_URL in .env |
| Port 5000 in use | Change PORT in .env |
| Port 5173 in use | Run `npm run dev -- --port 5174` |

---

Good luck! 🚀 Your complete registration system is ready to use.
