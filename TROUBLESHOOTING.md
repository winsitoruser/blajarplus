# 🔧 Troubleshooting Guide - BlajarPlus

**Last Updated:** December 29, 2024

---

## ❌ LOGIN TIDAK BISA / ERROR

### **Problem:** Login gagal atau error

### **Penyebab:**
1. Backend belum running
2. API URL salah
3. Database belum di-seed
4. CORS issue

### **Solusi:**

#### **1. Pastikan Backend Running**
```bash
cd backend
npm run start:dev

# Harus muncul:
# Nest application successfully started
# Listening on port 3001
```

#### **2. Cek API URL di Frontend**
File: `/frontend/src/lib/api.ts`
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
```
**PENTING:** Backend di port **3001**, bukan 3000!

#### **3. Test Backend API**
```bash
# Test health check
curl http://localhost:3001/api

# Test login endpoint
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"student1@test.com","password":"Test123!"}'
```

#### **4. Seed Database**
```bash
cd backend
npm run prisma:seed
```

#### **5. Clear Browser Cache**
- Clear localStorage
- Hard refresh (Cmd+Shift+R)
- Try incognito mode

---

## 🗄️ DATABASE ISSUES

### **Problem:** Prisma Client Error

### **Solusi:**
```bash
cd backend

# Regenerate Prisma Client
npx prisma generate

# If still error, reset database
npx prisma migrate reset

# Seed data
npm run prisma:seed
```

### **Problem:** Connection Error

### **Solusi:**
```bash
# Check PostgreSQL running
pg_isready

# Start PostgreSQL (Mac)
brew services start postgresql@14

# Check .env file
cat backend/.env
# DATABASE_URL should be correct
```

---

## 🔌 PORT ISSUES

### **Problem:** Port already in use

### **Solusi:**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

---

## 🌐 CORS ISSUES

### **Problem:** CORS error di browser console

### **Solusi:**
Check backend `main.ts`:
```typescript
app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: true,
});
```

---

## 📦 DEPENDENCY ISSUES

### **Problem:** Module not found

### **Solusi:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json .next
npm install
```

---

## 🔐 AUTH ISSUES

### **Problem:** Token invalid atau expired

### **Solusi:**
```bash
# Clear localStorage di browser console
localStorage.clear()

# Atau manual:
localStorage.removeItem('token')
localStorage.removeItem('user')
```

### **Problem:** JWT Secret tidak match

### **Solusi:**
Check `backend/.env`:
```
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

---

## 💳 PAYMENT ISSUES

### **Problem:** Midtrans error

### **Solusi:**
Check `backend/.env`:
```
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_IS_PRODUCTION=false
```

For testing, use Midtrans sandbox credentials.

---

## 📧 EMAIL ISSUES

### **Problem:** Email tidak terkirim

### **Note:** 
Email notifications belum fully implemented. Saat ini hanya log ke console.

---

## 🔍 DEBUGGING TIPS

### **1. Check Backend Logs**
```bash
cd backend
npm run start:dev

# Watch for errors in terminal
```

### **2. Check Browser Console**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### **3. Check Database**
```bash
cd backend
npx prisma studio

# Opens GUI at http://localhost:5555
```

### **4. Test API Directly**
Use Postman or curl:
```bash
# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"student1@test.com","password":"Test123!"}'

# Get profile (with token)
curl http://localhost:3001/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚨 COMMON ERRORS & FIXES

### **Error: "Cannot find module '@prisma/client'"**
```bash
cd backend
npx prisma generate
```

### **Error: "Port 3001 is already in use"**
```bash
lsof -ti:3001 | xargs kill -9
npm run start:dev
```

### **Error: "Network Error" di frontend**
- Backend tidak running
- API URL salah
- CORS issue

### **Error: "Invalid credentials"**
- Password salah
- User belum di-seed
- Check database

### **Error: "Token expired"**
```bash
# Clear localStorage
localStorage.clear()
# Login lagi
```

---

## 📋 CHECKLIST SEBELUM TESTING

- [ ] PostgreSQL running
- [ ] Backend running di port 3001
- [ ] Frontend running di port 3000
- [ ] Database sudah di-migrate
- [ ] Database sudah di-seed
- [ ] .env file sudah diisi
- [ ] API URL benar (3001, bukan 3000)
- [ ] Browser cache cleared

---

## 🆘 RESET EVERYTHING

Jika semua gagal, reset total:

```bash
# 1. Stop semua
# Ctrl+C di terminal backend & frontend

# 2. Reset database
cd backend
npx prisma migrate reset
npx prisma generate
npm run prisma:seed

# 3. Clear cache
cd ../frontend
rm -rf .next
npm run dev

# 4. Start backend
cd ../backend
npm run start:dev

# 5. Clear browser
# - Clear localStorage
# - Hard refresh
# - Try login
```

---

## 📞 STILL HAVING ISSUES?

1. Check error message carefully
2. Look at backend terminal logs
3. Look at browser console
4. Check database with Prisma Studio
5. Verify all credentials in TEST_CREDENTIALS.md

---

**Most Common Issue:** API URL menggunakan port 3000 instead of 3001!

**Quick Fix:**
```typescript
// frontend/src/lib/api.ts
const API_URL = 'http://localhost:3001/api' // ✅ Correct
// NOT: 'http://localhost:3000/api' // ❌ Wrong
```
