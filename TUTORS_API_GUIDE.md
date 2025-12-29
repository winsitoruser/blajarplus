# Tutors API Guide - Blajarplus

Panduan lengkap untuk menggunakan Tutors API endpoints.

---

## 🎯 Available Endpoints

### 1. Create Tutor Profile
**POST** `/api/tutors/profile`  
**Auth:** Required (JWT Token)  
**Role:** Tutor only

Membuat profile tutor untuk user yang sudah register sebagai tutor.

**Request Body:**
```json
{
  "bio": "Saya adalah guru matematika berpengalaman 5 tahun dengan passion mengajar",
  "education": "S1 Pendidikan Matematika, Universitas Indonesia",
  "experience": "5 tahun mengajar di sekolah swasta dan les privat",
  "subjects": ["Matematika", "Fisika"],
  "educationLevels": ["SD", "SMP", "SMA"],
  "hourlyRate": 150000,
  "city": "Jakarta Selatan",
  "province": "DKI Jakarta",
  "teachingMethods": ["online", "offline"],
  "teachingPreferences": "Saya bisa mengajar di rumah siswa atau di tempat umum"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/tutors/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Saya adalah guru matematika berpengalaman 5 tahun",
    "education": "S1 Pendidikan Matematika, Universitas Indonesia",
    "experience": "5 tahun mengajar di sekolah swasta",
    "subjects": ["Matematika", "Fisika"],
    "educationLevels": ["SD", "SMP", "SMA"],
    "hourlyRate": 150000,
    "city": "Jakarta Selatan",
    "province": "DKI Jakarta",
    "teachingMethods": ["online", "offline"],
    "teachingPreferences": "Bisa mengajar di rumah siswa"
  }'
```

**Response:**
```json
{
  "id": "tutor-uuid",
  "userId": "user-uuid",
  "bio": "Saya adalah guru matematika berpengalaman 5 tahun",
  "education": "S1 Pendidikan Matematika, Universitas Indonesia",
  "experience": "5 tahun mengajar di sekolah swasta",
  "hourlyRate": 150000,
  "city": "Jakarta Selatan",
  "province": "DKI Jakarta",
  "teachingMethods": ["online", "offline"],
  "teachingPreferences": "Bisa mengajar di rumah siswa",
  "educationLevels": ["SD", "SMP", "SMA"],
  "verificationStatus": "pending",
  "averageRating": 0,
  "totalReviews": 0,
  "totalStudents": 0,
  "user": {
    "id": "user-uuid",
    "fullName": "Jane Teacher",
    "email": "tutor@example.com",
    "avatarUrl": null
  },
  "subjects": [
    {
      "id": "subject-uuid",
      "name": "Matematika",
      "slug": "matematika",
      "category": {
        "id": "category-uuid",
        "name": "Akademik"
      }
    }
  ],
  "reviews": []
}
```

---

### 2. Update Tutor Profile
**PUT** `/api/tutors/profile`  
**Auth:** Required (JWT Token)  
**Role:** Tutor only

Update profile tutor yang sudah ada.

**Request Body:** (semua field optional)
```json
{
  "bio": "Updated bio",
  "hourlyRate": 200000,
  "city": "Jakarta Pusat"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/api/tutors/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hourlyRate": 200000,
    "city": "Jakarta Pusat"
  }'
```

---

### 3. Get My Tutor Profile
**GET** `/api/tutors/profile/me`  
**Auth:** Required (JWT Token)  
**Role:** Tutor only

Mendapatkan profile tutor milik user yang sedang login.

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/tutors/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. Search Tutors
**GET** `/api/tutors/search`  
**Auth:** Not required  
**Public endpoint**

Mencari tutor dengan berbagai filter.

**Query Parameters:**
- `q` (optional) - Search query (nama, bio, pendidikan)
- `subject` (optional) - Nama subject (e.g., "Matematika")
- `educationLevel` (optional) - Level pendidikan (e.g., "SMA")
- `city` (optional) - Kota (e.g., "Jakarta")
- `teachingMethod` (optional) - Metode mengajar ("online" atau "offline")
- `minPrice` (optional) - Harga minimum per jam
- `maxPrice` (optional) - Harga maximum per jam
- `minRating` (optional) - Rating minimum (1-5)
- `sortBy` (optional) - Sorting: "rating", "price_low", "price_high", "experience", "newest"
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**cURL Examples:**

**Basic search:**
```bash
curl -X GET "http://localhost:3000/api/tutors/search"
```

**Search by subject:**
```bash
curl -X GET "http://localhost:3000/api/tutors/search?subject=Matematika"
```

**Search with multiple filters:**
```bash
curl -X GET "http://localhost:3000/api/tutors/search?subject=Matematika&city=Jakarta&minPrice=100000&maxPrice=200000&sortBy=rating&page=1&limit=10"
```

**Full-text search:**
```bash
curl -X GET "http://localhost:3000/api/tutors/search?q=berpengalaman"
```

**Response:**
```json
{
  "data": [
    {
      "id": "tutor-uuid",
      "userId": "user-uuid",
      "bio": "Guru matematika berpengalaman",
      "hourlyRate": 150000,
      "city": "Jakarta Selatan",
      "averageRating": 4.8,
      "totalReviews": 25,
      "totalStudents": 50,
      "user": {
        "id": "user-uuid",
        "fullName": "Jane Teacher",
        "avatarUrl": null
      },
      "subjects": [
        {
          "id": "subject-uuid",
          "name": "Matematika",
          "category": {
            "name": "Akademik"
          }
        }
      ]
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 5. Get Tutor by ID
**GET** `/api/tutors/:id`  
**Auth:** Not required  
**Public endpoint**

Mendapatkan detail tutor berdasarkan ID.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/tutors/tutor-uuid-here"
```

**Response:**
```json
{
  "id": "tutor-uuid",
  "userId": "user-uuid",
  "bio": "Saya adalah guru matematika berpengalaman 5 tahun",
  "education": "S1 Pendidikan Matematika, Universitas Indonesia",
  "experience": "5 tahun mengajar",
  "hourlyRate": 150000,
  "city": "Jakarta Selatan",
  "province": "DKI Jakarta",
  "teachingMethods": ["online", "offline"],
  "educationLevels": ["SD", "SMP", "SMA"],
  "verificationStatus": "verified",
  "averageRating": 4.8,
  "totalReviews": 25,
  "totalStudents": 50,
  "user": {
    "id": "user-uuid",
    "fullName": "Jane Teacher",
    "email": "tutor@example.com",
    "avatarUrl": null
  },
  "subjects": [
    {
      "id": "subject-uuid",
      "name": "Matematika",
      "slug": "matematika",
      "category": {
        "id": "category-uuid",
        "name": "Akademik",
        "slug": "akademik"
      }
    }
  ],
  "reviews": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "Guru yang sangat baik!",
      "createdAt": "2024-12-29T00:00:00.000Z",
      "student": {
        "fullName": "John Doe",
        "avatarUrl": null
      }
    }
  ]
}
```

---

### 6. Get All Subjects
**GET** `/api/tutors/subjects`  
**Auth:** Not required  
**Public endpoint**

Mendapatkan semua subject yang tersedia.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/tutors/subjects"
```

**Response:**
```json
[
  {
    "id": "subject-uuid",
    "name": "Matematika",
    "slug": "matematika",
    "category": {
      "id": "category-uuid",
      "name": "Akademik",
      "slug": "akademik"
    }
  },
  {
    "id": "subject-uuid-2",
    "name": "Fisika",
    "slug": "fisika",
    "category": {
      "id": "category-uuid",
      "name": "Akademik",
      "slug": "akademik"
    }
  }
]
```

---

### 7. Get Subject Categories
**GET** `/api/tutors/categories`  
**Auth:** Not required  
**Public endpoint**

Mendapatkan semua kategori subject beserta subject-nya.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/tutors/categories"
```

**Response:**
```json
[
  {
    "id": "category-uuid",
    "name": "Akademik",
    "slug": "akademik",
    "subjects": [
      {
        "id": "subject-uuid",
        "name": "Matematika",
        "slug": "matematika"
      },
      {
        "id": "subject-uuid-2",
        "name": "Fisika",
        "slug": "fisika"
      }
    ]
  },
  {
    "id": "category-uuid-2",
    "name": "Bahasa",
    "slug": "bahasa",
    "subjects": [
      {
        "id": "subject-uuid-3",
        "name": "Bahasa Inggris",
        "slug": "bahasa-inggris"
      }
    ]
  }
]
```

---

## 🧪 Complete Testing Flow

### Step 1: Register as Tutor
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

**Save the token from response!**

### Step 2: Create Tutor Profile
```bash
curl -X POST http://localhost:3000/api/tutors/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Guru matematika berpengalaman 5 tahun",
    "education": "S1 Pendidikan Matematika, UI",
    "experience": "5 tahun mengajar",
    "subjects": ["Matematika", "Fisika"],
    "educationLevels": ["SMA"],
    "hourlyRate": 150000,
    "city": "Jakarta",
    "province": "DKI Jakarta",
    "teachingMethods": ["online", "offline"]
  }'
```

### Step 3: Get My Profile
```bash
curl -X GET http://localhost:3000/api/tutors/profile/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Search Tutors (Public)
```bash
curl -X GET "http://localhost:3000/api/tutors/search?subject=Matematika"
```

### Step 5: Get Subjects List
```bash
curl -X GET "http://localhost:3000/api/tutors/subjects"
```

---

## 📊 Database Verification

### Check Tutor Profiles
```bash
cd backend
npm run prisma:studio
# Open http://localhost:5555
# Navigate to TutorProfile table
```

### SQL Query
```sql
-- Get all tutors with their subjects
SELECT 
  tp.id,
  u.full_name,
  tp.hourly_rate,
  tp.city,
  tp.verification_status,
  array_agg(s.name) as subjects
FROM tutor_profiles tp
JOIN users u ON tp.user_id = u.id
LEFT JOIN tutor_subjects ts ON tp.id = ts.tutor_id
LEFT JOIN subjects s ON ts.subject_id = s.id
GROUP BY tp.id, u.full_name, tp.hourly_rate, tp.city, tp.verification_status;
```

---

## ⚠️ Important Notes

### Verification Status
- Tutor profile dibuat dengan status `pending`
- Hanya tutor dengan status `verified` yang muncul di search
- Admin perlu verify tutor profile secara manual (fitur admin akan dibuat nanti)

### Temporary Workaround untuk Testing
Untuk testing search, ubah status tutor menjadi `verified`:

```sql
UPDATE tutor_profiles 
SET verification_status = 'verified' 
WHERE user_id = 'your-user-id';
```

Atau via Prisma Studio:
1. Buka http://localhost:5555
2. Pilih `TutorProfile`
3. Edit record
4. Ubah `verificationStatus` menjadi `verified`
5. Save

---

## 🎯 Next Steps

1. ✅ Test all Tutors endpoints
2. 🔨 Create frontend search page
3. 🔨 Create tutor profile page
4. 🔨 Create tutor registration flow
5. 🔨 Implement admin verification

---

## 📝 API Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/tutors/profile` | POST | ✅ | Create tutor profile |
| `/api/tutors/profile` | PUT | ✅ | Update tutor profile |
| `/api/tutors/profile/me` | GET | ✅ | Get my profile |
| `/api/tutors/search` | GET | ❌ | Search tutors |
| `/api/tutors/:id` | GET | ❌ | Get tutor by ID |
| `/api/tutors/subjects` | GET | ❌ | Get all subjects |
| `/api/tutors/categories` | GET | ❌ | Get categories |

**Total Endpoints:** 7 endpoints  
**Public:** 4 endpoints  
**Protected:** 3 endpoints

---

**Happy Testing! 🎉**
