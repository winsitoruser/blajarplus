# API Testing Guide - Blajarplus

Panduan lengkap untuk testing API Blajarplus.

---

## 🔧 Testing Tools

### 1. Swagger UI (Recommended)
**URL:** http://localhost:3000/api/docs

**Advantages:**
- Interactive interface
- Auto-generated from code
- Try endpoints directly
- See request/response schemas

### 2. cURL (Command Line)
**Advantages:**
- Quick testing
- Scriptable
- No GUI needed

### 3. Postman/Insomnia
**Advantages:**
- Save requests
- Collections
- Environment variables

---

## 📝 API Endpoints

### Authentication

#### 1. Register Student
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Password123",
    "fullName": "John Doe",
    "role": "student"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student",
    "createdAt": "2024-12-29T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. Register Tutor
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tutor@example.com",
    "password": "Password123",
    "fullName": "Jane Teacher",
    "role": "tutor"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "student@example.com",
    "password": "Password123"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student",
    "avatarUrl": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token for authenticated requests!**

#### 4. Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "id": "uuid",
  "email": "student@example.com",
  "phone": null,
  "fullName": "John Doe",
  "role": "student",
  "status": "active",
  "avatarUrl": null
}
```

---

### Users

#### 1. Get User Profile
```bash
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. Update User Profile
```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated Doe",
    "gender": "male",
    "birthdate": "1995-01-15"
  }'
```

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Registration Flow

```bash
# 1. Register as student
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "fullName": "Test User",
    "role": "student"
  }'

# Save the token from response

# 2. Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. Update profile
curl -X PUT http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User Updated",
    "gender": "male"
  }'

# 4. Login again
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "Test123456"
  }'
```

### Scenario 2: Error Handling

```bash
# 1. Register with existing email (should fail)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "fullName": "Test User",
    "role": "student"
  }'

# Expected: 409 Conflict

# 2. Login with wrong password (should fail)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "test@example.com",
    "password": "WrongPassword"
  }'

# Expected: 401 Unauthorized

# 3. Access protected route without token (should fail)
curl -X GET http://localhost:3000/api/auth/me

# Expected: 401 Unauthorized
```

---

## 📊 Database Queries

### Check Users in Database

```bash
# Using Prisma Studio
cd backend
npm run prisma:studio
# Open http://localhost:5555
```

### Direct PostgreSQL Query

```bash
# Connect to database
psql -U postgres -d blajarplus

# List all users
SELECT id, email, full_name, role, status, created_at FROM users;

# Count users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

# Find user by email
SELECT * FROM users WHERE email = 'test@example.com';
```

---

## 🔍 Debugging Tips

### 1. Check Backend Logs
Backend logs akan menampilkan semua requests:
```
[Nest] 5983  - 12/29/2025, 12:28:39 AM     LOG [RouterExplorer] Mapped {/api/auth/register, POST} route
```

### 2. Check Response Headers
```bash
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrPhone":"test@example.com","password":"Test123456"}'
```

### 3. Verbose cURL Output
```bash
curl -v -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Pretty Print JSON Response
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

---

## 🎯 Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate email |
| 500 | Server Error | Internal error |

---

## 📝 Postman Collection

### Import to Postman

Create a new collection with these requests:

**1. Register Student**
- Method: POST
- URL: `{{baseUrl}}/auth/register`
- Body (JSON):
```json
{
  "email": "student@example.com",
  "password": "Password123",
  "fullName": "John Doe",
  "role": "student"
}
```

**2. Login**
- Method: POST
- URL: `{{baseUrl}}/auth/login`
- Body (JSON):
```json
{
  "emailOrPhone": "student@example.com",
  "password": "Password123"
}
```
- Tests (save token):
```javascript
pm.environment.set("token", pm.response.json().token);
```

**3. Get Current User**
- Method: GET
- URL: `{{baseUrl}}/auth/me`
- Headers:
  - Authorization: `Bearer {{token}}`

**Environment Variables:**
```json
{
  "baseUrl": "http://localhost:3000/api",
  "token": ""
}
```

---

## 🔐 Authentication Flow

```
1. Register/Login
   ↓
2. Receive JWT token
   ↓
3. Store token (localStorage/cookie)
   ↓
4. Include in Authorization header
   ↓
5. Access protected routes
```

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Payload:**
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "student",
  "iat": 1703808000,
  "exp": 1704412800
}
```

---

## 🧪 Automated Testing

### Using Jest (Backend)

```bash
cd backend
npm run test
```

### Example Test
```typescript
describe('AuthController', () => {
  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test123456',
        fullName: 'Test User',
        role: 'student',
      })
      .expect(201);

    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

---

## 📚 Next Steps

1. ✅ Test all authentication endpoints
2. ✅ Verify database entries
3. 🔨 Implement Tutors endpoints
4. 🔨 Test Tutors endpoints
5. 🔨 Implement Bookings endpoints
6. 🔨 Test Bookings endpoints

---

**Happy Testing! 🧪**
