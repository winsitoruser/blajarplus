# 🚀 Quick Start Guide - BlajarPlus

**Last Updated:** December 29, 2024

---

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

---

## ⚡ Quick Setup (5 Minutes)

### **1. Clone & Install**

```bash
# Clone repository
git clone https://github.com/winsitoruser/blajarplus.git
cd blajarplus

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### **2. Database Setup**

```bash
cd backend

# Create .env file
cp .env.example .env

# Edit .env with your database credentials:
DATABASE_URL="postgresql://user:password@localhost:5432/blajarplus"
JWT_SECRET="your-secret-key-here"
MIDTRANS_SERVER_KEY="your-midtrans-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed dummy data
npm run prisma:seed
```

### **3. Start Backend**

```bash
cd backend
npm run start:dev

# Backend running at http://localhost:3001
```

### **4. Start Frontend**

```bash
cd frontend
npm run dev

# Frontend running at http://localhost:3000
```

---

## 🔐 Test Credentials

### **Login as Student:**
```
Email: student1@test.com
Password: Test123!
```

### **Login as Tutor:**
```
Email: tutor1@test.com
Password: Test123!
```

### **Login as Admin:**
```
Email: admin@blajarplus.com
Password: Test123!
```

---

## 🎯 Quick Test Flow

### **As Student:**
1. Go to http://localhost:3000
2. Login with `student1@test.com / Test123!`
3. Click "Cari Tutor"
4. Browse tutors
5. Click on a tutor profile
6. Try booking a session

### **As Tutor:**
1. Login with `tutor1@test.com / Test123!`
2. Go to Dashboard
3. View students list
4. Manage schedule
5. Check earnings

### **As Admin:**
1. Login with `admin@blajarplus.com / Test123!`
2. View pending verifications
3. Approve/reject tutors
4. Manage withdrawals

---

## 📊 What's Included in Dummy Data

- **7 Users:** 1 admin, 3 tutors, 3 students
- **3 Verified Tutors:** With profiles, subjects, availability
- **10 Subjects:** Matematika, Fisika, Bahasa Inggris, Programming, etc.
- **21 Availability Slots:** Weekly schedules for all tutors
- **Ready to book:** All tutors have active schedules

---

## 🔧 Common Commands

### **Backend:**
```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Prisma Studio (Database GUI)
npx prisma studio

# Reset & Reseed Database
npx prisma migrate reset
```

### **Frontend:**
```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

---

## 📁 Project Structure

```
blajarplus/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication
│   │   ├── users/         # User management
│   │   ├── tutors/        # Tutor features
│   │   ├── bookings/      # Booking system
│   │   ├── payments/      # Payment integration
│   │   ├── chat/          # Messaging
│   │   ├── reviews/       # Review system
│   │   ├── admin/         # Admin features
│   │   ├── withdrawals/   # Withdrawal system
│   │   └── notifications/ # Notifications
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.ts        # Dummy data
│   └── .env               # Environment variables
│
└── frontend/
    ├── src/
    │   ├── app/           # Next.js pages
    │   ├── components/    # React components
    │   └── lib/           # Utilities
    └── .env.local         # Frontend env vars
```

---

## 🌐 Available URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Docs:** http://localhost:3001/api
- **Prisma Studio:** http://localhost:5555

---

## 🐛 Troubleshooting

### **Database Connection Error:**
```bash
# Check PostgreSQL is running
pg_isready

# Verify DATABASE_URL in .env
# Make sure database exists
createdb blajarplus
```

### **Prisma Client Error:**
```bash
# Regenerate Prisma client
npx prisma generate

# If still issues, reset:
npx prisma migrate reset
npx prisma generate
```

### **Port Already in Use:**
```bash
# Backend (3001)
lsof -ti:3001 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### **Seed Script Fails:**
```bash
# Make sure migrations are up to date
npx prisma migrate dev

# Try seeding again
npm run prisma:seed
```

---

## 📚 Documentation

- **Full Documentation:** See `PROJECT_COMPLETE_SUMMARY.md`
- **Test Credentials:** See `TEST_CREDENTIALS.md`
- **API Endpoints:** Visit http://localhost:3001/api
- **User Flows:** See `docs/user-flows.md`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend running on port 3001
- [ ] Frontend running on port 3000
- [ ] Can login as student
- [ ] Can login as tutor
- [ ] Can search tutors
- [ ] Can view tutor profiles
- [ ] Database has dummy data
- [ ] API docs accessible

---

## 🎉 You're Ready!

The platform is now running with dummy data. You can:

✅ Test all features
✅ Browse tutors
✅ Book sessions
✅ Manage schedules
✅ Track progress
✅ Process payments (test mode)

**Happy Testing! 🚀**

---

**Need Help?** Check the documentation files or review the code comments.
