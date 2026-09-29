# Registration to MongoDB Flow - Visual Guide

## 🎯 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION PROCESS                        │
└─────────────────────────────────────────────────────────────────────┘

1️⃣  FRONTEND - Registration Form
   ┌──────────────────────────┐
   │ Fill in:                 │
   │ • First Name             │
   │ • Last Name              │
   │ • Email                  │
   │ • Username               │
   │ • Password (min 6 chars) │
   │ • Confirm Password       │
   │                          │
   │ [Register Button]        │
   └──────────────────────────┘
            ↓
2️⃣  FRONTEND - Client Validation
   ✓ Check all fields filled
   ✓ Check passwords match
   ✓ Check password length >= 6
            ↓
3️⃣  HTTP POST Request
   POST /api/auth/register
   {
     firstName: "John",
     lastName: "Doe",
     email: "john@example.com",
     username: "johndoe",
     password: "hashedPassword123",
     confirmPassword: "hashedPassword123"
   }
            ↓
4️⃣  BACKEND - Server Validation
   ✓ Validate all fields
   ✓ Check passwords match
   ✓ Check email not already registered
   ✓ Check username not already registered
            ↓
5️⃣  BACKEND - Password Hashing
   password: "hashedPassword123"
   →  bcrypt.hash() →  "$2a$10$..."
            ↓
6️⃣  BACKEND - Generate Tokens
   • Email Verification Token: random 32 bytes hex
   • Token Hash: SHA256(token)
   • Expiry: 24 hours from now
            ↓
7️⃣  BACKEND - Save to MongoDB
   
   Database: interviewiq
   Collection: users
   Document:
   {
     "_id": ObjectId("..."),
     "email": "john@example.com",
     "username": "johndoe",
     "firstName": "John",
     "lastName": "Doe",
     "password": "$2a$10$...",           // HASHED
     "isEmailVerified": false,           // Not verified yet
     "emailVerificationToken": "sha256hash...",
     "emailVerificationExpiry": ISODate("2026-06-11T..."),
     "createdAt": ISODate("2026-06-10T..."),
     "updatedAt": ISODate("2026-06-10T...")
   }
            ↓
8️⃣  BACKEND - Send Verification Email
   To: john@example.com
   Subject: Email Verification - InterviewIQ
   Body: Click link to verify:
   http://localhost:5173/verify-email/TOKEN
            ↓
9️⃣  BACKEND - Success Response (201)
   {
     "message": "User registered successfully.",
     "user": {
       "id": "...",
       "email": "john@example.com",
       "username": "johndoe",
       "firstName": "John",
       "lastName": "Doe"
     }
   }
            ↓
🔟 FRONTEND - Show Success Modal
   ┌─────────────────────────────────┐
   │  Registration Successful! 🎉    │
   │                                 │
   │  ✓ User saved to MongoDB        │
   │  ✓ Verification email sent      │
   │  ✓ Account ready for use        │
   │                                 │
   │  Check your email for          │
   │  verification link              │
   │                                 │
   │  [Continue to Login]            │
   └─────────────────────────────────┘
            ↓
1️⃣1️⃣ AUTO REDIRECT (3 seconds)
   → Navigate to /login page
            ↓
1️⃣2️⃣ USER CLICKS EMAIL VERIFICATION LINK
   /verify-email/TOKEN
            ↓
1️⃣3️⃣ BACKEND VERIFIES EMAIL
   • Find user by token hash
   • Check token not expired (24 hours)
   • Set isEmailVerified = true
   • Save to MongoDB
            ↓
1️⃣4️⃣ FRONTEND SHOWS VERIFICATION SUCCESS
   "Email verified successfully! You can now log in."
            ↓
1️⃣5️⃣ USER LOGIN
   • Enter email & password
   • Backend validates credentials
   • Generate JWT token
   • Store token in localStorage
   • Redirect to dashboard
```

---

## 📊 MongoDB Data Structure

### User Document Example

```json
{
  "_id": ObjectId("6649a1f2b5c8d9e0f1234567"),
  "email": "john@example.com",
  "username": "johndoe123",
  "firstName": "John",
  "lastName": "Doe",
  "password": "$2a$10$kI8KZtIvqd.8E/qQqQq8K.IzU6gMFu8Qu8Qu8QuK8u8u8",
  "phoneNumber": null,
  "profilePicture": null,
  "resume": {
    "url": null,
    "uploadedAt": null,
    "fileName": null
  },
  "isEmailVerified": false,
  "emailVerificationToken": "3f4d7c8e9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c",
  "emailVerificationExpiry": ISODate("2026-06-11T14:23:45.123Z"),
  "resetPasswordToken": null,
  "resetPasswordTokenExpiry": null,
  "preferredRole": null,
  "targetCompanies": [],
  "createdAt": ISODate("2026-06-10T14:23:45.123Z"),
  "updatedAt": ISODate("2026-06-10T14:23:45.123Z")
}
```

---

## ✅ What Gets Stored

| Field | Value | Type | Stored |
|-------|-------|------|--------|
| Email | john@example.com | String | ✅ Yes |
| Username | johndoe123 | String | ✅ Yes |
| First Name | John | String | ✅ Yes |
| Last Name | Doe | String | ✅ Yes |
| Password | $2a$10$... | Hashed | ✅ Yes (SECURE) |
| Verified | false | Boolean | ✅ Yes |
| Verification Token | Hash | String | ✅ Yes (Temporary) |
| Created Date | 2026-06-10... | Date | ✅ Yes |

---

## 🔒 Security Features

1. **Password Hashing**
   - Uses bcryptjs (10 salt rounds)
   - Never stores plain text passwords
   - Passwords are salted and hashed

2. **Email Verification**
   - Requires user to verify email
   - Token expires in 24 hours
   - User cannot login until verified

3. **Token Security**
   - Verification token is hashed
   - Tokens are randomly generated
   - Tokens have expiration times

4. **Data Validation**
   - Frontend validation (client-side)
   - Backend validation (server-side)
   - Double check ensures security

---

## 🧪 Testing Registration

### Test Case 1: Successful Registration
```
Input:
  FirstName: Test
  LastName: User
  Email: test@example.com
  Username: testuser123
  Password: Password123
  Confirm: Password123

Expected:
  ✓ Green success modal appears
  ✓ User document created in MongoDB
  ✓ Verification email sent
  ✓ Redirects to login after 3 seconds
```

### Test Case 2: Password Mismatch
```
Input:
  Passwords don't match

Expected:
  ✗ Red error: "Passwords do not match"
  ✗ No MongoDB entry created
```

### Test Case 3: Email Already Exists
```
Input:
  Email already registered

Expected:
  ✗ Red error: "Email or username already exists"
  ✗ No duplicate entry created
```

### Test Case 4: Missing Fields
```
Input:
  Any field empty

Expected:
  ✗ Red error: "All fields are required"
  ✗ Form doesn't submit
```

---

## 🔍 Verify Data in MongoDB

### MongoDB Compass (Desktop App)
1. Connect with your connection string
2. Browse: interviewiq → users
3. Click on your user document
4. See all fields including hashed password

### MongoDB Atlas (Web UI)
1. Go to cloud.mongodb.com
2. Click your cluster
3. Click "Collections"
4. Select users collection
5. See all registered users

### Via Backend Console
```javascript
// In backend logs, see:
// "User registered: john@example.com"
// "MongoDB Connected"
// "User saved successfully"
```

---

## ❌ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| User not created | Check MongoDB connection |
| Email not sent | Verify Gmail credentials |
| Success modal doesn't appear | Check component import |
| Password showing in DB | It's hashed - this is correct! |
| Duplicate users created | Email/username validation missing |

---

## 📝 Registration Success Checklist

After registration:

- [ ] Green success modal appears
- [ ] Modal says "Registration Successful! 🎉"
- [ ] User saved in MongoDB
- [ ] No sensitive data (passwords) shown
- [ ] Email verification sent
- [ ] Auto-redirect to login happens
- [ ] User can click email verification link
- [ ] User can then login with credentials

---

## 🚀 Next: Email Verification Flow

After user clicks verification email link:

```
/verify-email/TOKEN
    ↓
Backend finds user by token hash
    ↓
Checks token not expired (24 hours)
    ↓
Sets isEmailVerified = true
    ↓
Deletes verification token
    ↓
Frontend shows success
    ↓
User can now login
```

---

## 🎯 Complete Test Flow

1. **Register** → See success modal
2. **Check Email** → Click verification link
3. **See Confirmed** → Email verified message
4. **Login** → Use email & password
5. **See Dashboard** → Registration complete! ✅

---

Good luck testing! 🚀
