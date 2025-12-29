# Reviews API Guide - Blajarplus

Panduan lengkap untuk menggunakan Reviews API endpoints.

---

## 🎯 Available Endpoints

### 1. Create Review
**POST** `/api/reviews`  
**Auth:** Required (JWT Token)  
**Role:** Student only

Membuat review untuk booking yang sudah completed.

**Request Body:**
```json
{
  "bookingId": "booking-uuid",
  "rating": 5,
  "comment": "Guru yang sangat baik dan sabar! Penjelasannya mudah dipahami."
}
```

**Field Descriptions:**
- `bookingId` - ID booking yang sudah completed
- `rating` - Rating 1-5 (required)
- `comment` - Komentar/review text (optional)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-uuid",
    "rating": 5,
    "comment": "Guru yang sangat baik dan sabar!"
  }'
```

**Response:**
```json
{
  "id": "review-uuid",
  "bookingId": "booking-uuid",
  "studentId": "student-uuid",
  "tutorId": "tutor-uuid",
  "rating": 5,
  "comment": "Guru yang sangat baik dan sabar!",
  "createdAt": "2024-12-29T00:00:00.000Z",
  "updatedAt": "2024-12-29T00:00:00.000Z",
  "student": {
    "id": "student-uuid",
    "fullName": "John Doe",
    "avatarUrl": null
  },
  "tutor": {
    "id": "tutor-uuid",
    "user": {
      "id": "user-uuid",
      "fullName": "Jane Teacher",
      "avatarUrl": null
    }
  },
  "booking": {
    "id": "booking-uuid",
    "subject": {
      "id": "subject-uuid",
      "name": "Matematika"
    }
  }
}
```

---

### 2. Get My Reviews
**GET** `/api/reviews/my-reviews`  
**Auth:** Required (JWT Token)  
**Role:** Student

Mendapatkan semua review yang pernah dibuat oleh student.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**cURL Examples:**

**Get all my reviews:**
```bash
curl -X GET "http://localhost:3000/api/reviews/my-reviews" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**With pagination:**
```bash
curl -X GET "http://localhost:3000/api/reviews/my-reviews?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "Guru yang sangat baik!",
      "createdAt": "2024-12-29T00:00:00.000Z",
      "tutor": {
        "id": "tutor-uuid",
        "user": {
          "fullName": "Jane Teacher",
          "avatarUrl": null
        }
      },
      "booking": {
        "subject": {
          "name": "Matematika"
        }
      }
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 3. Get Tutor Reviews
**GET** `/api/reviews/tutor/:tutorId`  
**Auth:** Not required  
**Public endpoint**

Mendapatkan semua review untuk tutor tertentu.

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/reviews/tutor/tutor-uuid?page=1&limit=10"
```

**Response:**
```json
{
  "data": [
    {
      "id": "review-uuid",
      "rating": 5,
      "comment": "Guru yang sangat baik dan sabar!",
      "createdAt": "2024-12-29T00:00:00.000Z",
      "student": {
        "id": "student-uuid",
        "fullName": "John Doe",
        "avatarUrl": null
      },
      "booking": {
        "subject": {
          "name": "Matematika"
        }
      }
    },
    {
      "id": "review-uuid-2",
      "rating": 4,
      "comment": "Penjelasannya jelas",
      "createdAt": "2024-12-28T00:00:00.000Z",
      "student": {
        "fullName": "Jane Smith",
        "avatarUrl": null
      },
      "booking": {
        "subject": {
          "name": "Fisika"
        }
      }
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "averageRating": 4.8,
    "ratingDistribution": {
      "5": 20,
      "4": 4,
      "3": 1,
      "2": 0,
      "1": 0
    }
  }
}
```

---

### 4. Get Review by ID
**GET** `/api/reviews/:id`  
**Auth:** Not required  
**Public endpoint**

Mendapatkan detail review berdasarkan ID.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/reviews/review-uuid"
```

**Response:**
```json
{
  "id": "review-uuid",
  "bookingId": "booking-uuid",
  "studentId": "student-uuid",
  "tutorId": "tutor-uuid",
  "rating": 5,
  "comment": "Guru yang sangat baik dan sabar!",
  "createdAt": "2024-12-29T00:00:00.000Z",
  "updatedAt": "2024-12-29T00:00:00.000Z",
  "student": {
    "id": "student-uuid",
    "fullName": "John Doe",
    "avatarUrl": null
  },
  "tutor": {
    "id": "tutor-uuid",
    "user": {
      "fullName": "Jane Teacher",
      "avatarUrl": null
    }
  },
  "booking": {
    "subject": {
      "name": "Matematika"
    }
  }
}
```

---

### 5. Update Review
**PUT** `/api/reviews/:id`  
**Auth:** Required (JWT Token)  
**Role:** Student (owner only)

Update review yang sudah dibuat.

**Request Body:** (semua field optional)
```json
{
  "rating": 4,
  "comment": "Updated comment"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/reviews/review-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Updated: Guru yang baik"
  }'
```

---

### 6. Delete Review
**DELETE** `/api/reviews/:id`  
**Auth:** Required (JWT Token)  
**Role:** Student (owner only)

Hapus review yang sudah dibuat.

**cURL Example:**
```bash
curl -X DELETE "http://localhost:3000/api/reviews/review-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

---

## 🧪 Complete Testing Flow

### Scenario 1: Student Creates Review After Lesson

```bash
# 1. Login as student
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "student@example.com",
    "password": "Password123"
  }'

# Save student token

# 2. Get completed bookings
curl -X GET "http://localhost:3000/api/bookings?status=completed" \
  -H "Authorization: Bearer STUDENT_TOKEN"

# Get booking ID from response

# 3. Create review
curl -X POST http://localhost:3000/api/reviews \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "booking-uuid",
    "rating": 5,
    "comment": "Guru yang sangat baik dan sabar!"
  }'

# 4. View my reviews
curl -X GET "http://localhost:3000/api/reviews/my-reviews" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Scenario 2: Public Views Tutor Reviews

```bash
# 1. Search for tutors
curl -X GET "http://localhost:3000/api/tutors/search?subject=Matematika"

# Get tutor ID from response

# 2. View tutor's reviews (no auth needed)
curl -X GET "http://localhost:3000/api/reviews/tutor/tutor-uuid"

# 3. View specific review
curl -X GET "http://localhost:3000/api/reviews/review-uuid"
```

### Scenario 3: Student Updates Review

```bash
# Update review
curl -X PUT "http://localhost:3000/api/reviews/review-uuid" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 4,
    "comment": "Updated: Guru yang baik, tapi bisa lebih detail"
  }'
```

### Scenario 4: Student Deletes Review

```bash
# Delete review
curl -X DELETE "http://localhost:3000/api/reviews/review-uuid" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

---

## 📊 Business Rules

### 1. Review Creation
- ✅ Only students can create reviews
- ✅ Can only review completed bookings
- ✅ One review per booking
- ✅ Rating must be 1-5
- ✅ Comment is optional

### 2. Review Update/Delete
- ✅ Only review owner can update/delete
- ✅ No time limit for updates

### 3. Tutor Rating Calculation
- ✅ Average rating auto-calculated
- ✅ Total reviews auto-counted
- ✅ Updates on create/update/delete
- ✅ Rating distribution tracked

### 4. Public Access
- ✅ Anyone can view tutor reviews
- ✅ Anyone can view specific review
- ✅ Student name visible in reviews

---

## 📈 Rating Distribution

Reviews include rating distribution in tutor reviews:

```json
{
  "ratingDistribution": {
    "5": 20,  // 20 reviews with 5 stars
    "4": 4,   // 4 reviews with 4 stars
    "3": 1,   // 1 review with 3 stars
    "2": 0,   // 0 reviews with 2 stars
    "1": 0    // 0 reviews with 1 star
  }
}
```

This helps show:
- How many students gave each rating
- Quality consistency
- Trust indicators

---

## ⚠️ Error Scenarios

### Booking Not Found
```json
{
  "statusCode": 404,
  "message": "Booking not found"
}
```

### Not Your Booking
```json
{
  "statusCode": 403,
  "message": "You can only review your own bookings"
}
```

### Booking Not Completed
```json
{
  "statusCode": 400,
  "message": "Can only review completed bookings"
}
```

### Review Already Exists
```json
{
  "statusCode": 400,
  "message": "Review already exists for this booking"
}
```

### Review Not Found
```json
{
  "statusCode": 404,
  "message": "Review not found"
}
```

### Not Your Review
```json
{
  "statusCode": 403,
  "message": "You can only update your own reviews"
}
```

---

## 📝 API Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/reviews` | POST | ✅ | Create review |
| `/api/reviews/my-reviews` | GET | ✅ | Get my reviews |
| `/api/reviews/tutor/:tutorId` | GET | ❌ | Get tutor reviews |
| `/api/reviews/:id` | GET | ❌ | Get review by ID |
| `/api/reviews/:id` | PUT | ✅ | Update review |
| `/api/reviews/:id` | DELETE | ✅ | Delete review |

**Total Endpoints:** 6 endpoints  
**Public:** 2 endpoints  
**Protected:** 4 endpoints

---

## 🎯 Integration with Other Modules

### With Bookings
- Reviews linked to completed bookings
- One review per booking
- Booking must be completed

### With Tutors
- Auto-updates tutor's averageRating
- Auto-updates tutor's totalReviews
- Affects tutor search ranking

### With Students
- Students can view their review history
- Reviews show student name publicly

---

## 💡 Frontend Integration Tips

### Display Reviews on Tutor Profile
```javascript
// Fetch tutor reviews
const response = await fetch(`/api/reviews/tutor/${tutorId}?page=1&limit=10`);
const { data, meta } = await response.json();

// Display:
// - Average rating: meta.averageRating
// - Total reviews: meta.total
// - Rating distribution: meta.ratingDistribution
// - Reviews list: data
```

### Create Review Form
```javascript
// After booking completed
const createReview = async (bookingId, rating, comment) => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ bookingId, rating, comment })
  });
  return response.json();
};
```

---

## 🎯 Next Steps

1. ✅ Test all Reviews endpoints
2. 🔨 Create review form UI
3. 🔨 Display reviews on tutor profile
4. 🔨 Add review moderation (admin)
5. 🔨 Add helpful/unhelpful votes

---

**Happy Testing! 🎉**
