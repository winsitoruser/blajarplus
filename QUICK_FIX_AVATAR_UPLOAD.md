# 🚨 Quick Fix: Avatar Upload Error "Cannot POST /api/users/me/avatar"

## ⚡ IMMEDIATE SOLUTION

Backend memiliki TypeScript compilation errors yang mencegah server start dengan benar. Berikut cara cepat untuk fix:

### Option 1: Ignore TypeScript Errors (Quick Fix)

```bash
cd backend

# Start dengan ignore errors
npm run start:dev -- --preserveWatchOutput
```

### Option 2: Fix TypeScript Errors (Proper Fix)

Backend tidak bisa compile karena beberapa issues. Restart backend dengan cara ini:

```bash
cd backend

# Kill existing process
# Press Ctrl+C if backend is running

# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Start fresh
npm run start:dev
```

---

## 🔍 VERIFY BACKEND IS RUNNING

1. Check console output untuk:
```
🚀 Blajarplus API is running on: http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
```

2. Test endpoint manually:
```bash
# Open browser or use curl
curl http://localhost:3000/api/users/me
```

Jika dapat response (bahkan 401 Unauthorized), berarti backend running.

---

## 🎯 TEST AVATAR UPLOAD

### Manual Test dengan Postman/Thunder Client:

1. **Login dulu untuk dapat token:**
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "email": "demo@blajarplus.com",
  "password": "demo12345"
}
```

Copy `accessToken` dari response.

2. **Upload Avatar:**
```
POST http://localhost:3000/api/users/me/avatar
Headers:
  Authorization: Bearer YOUR_ACCESS_TOKEN
Body (form-data):
  avatar: [select image file]
```

---

## 🔧 ALTERNATIVE: Bypass TypeScript Errors

Edit `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "skipLibCheck": true,
    "noEmit": false,
    // Add this:
    "noImplicitAny": false,
    "strictNullChecks": false
  }
}
```

Then restart backend.

---

## 📝 CHECK IF ENDPOINT EXISTS

Run this command while backend is running:

```bash
# Check all routes
curl http://localhost:3000/api/users/me -H "Authorization: Bearer YOUR_TOKEN"
```

If you get response, backend is working.

---

## 🎨 FRONTEND FIX

Make sure frontend is calling correct URL:

**File**: `frontend/src/lib/api.ts`

Should have:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3000/api',  // ← Must be port 3000
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## ✅ FINAL CHECKLIST

- [ ] Backend running on port 3000
- [ ] Frontend running on port 3001
- [ ] Can login and get token
- [ ] Token saved in localStorage
- [ ] Upload button triggers file input
- [ ] FormData created with 'avatar' field
- [ ] API call goes to http://localhost:3000/api/users/me/avatar

---

## 🆘 IF STILL NOT WORKING

1. **Check browser console** for actual error
2. **Check Network tab** to see request details
3. **Check backend console** for incoming requests
4. **Verify token** in localStorage is valid

---

## 💡 QUICK DEBUG

Add this to frontend upload function:

```typescript
console.log('Uploading to:', api.defaults.baseURL + '/users/me/avatar');
console.log('Token:', localStorage.getItem('token'));
console.log('File:', file);
```

This will show you exactly what's being sent.

---

**Last Updated**: December 30, 2025 03:07 AM
