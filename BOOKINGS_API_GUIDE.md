# Bookings API Guide - Blajarplus

Panduan lengkap untuk menggunakan Bookings API endpoints.

---

## 🎯 Available Endpoints

### 1. Create Booking
**POST** `/api/bookings`  
**Auth:** Required (JWT Token)  
**Role:** Student

Membuat booking baru untuk les dengan tutor.

**Request Body:**
```json
{
  "tutorId": "tutor-uuid",
  "subjectId": "subject-uuid",
  "scheduledAt": "2024-12-30T10:00:00.000Z",
  "duration": 2,
  "bookingType": "single",
  "numberOfSessions": 1,
  "notes": "Tolong fokus ke materi trigonometri",
  "location": "Jl. Sudirman No. 123, Jakarta",
  "teachingMethod": "online"
}
```

**Field Descriptions:**
- `tutorId` - ID tutor yang ingin di-booking
- `subjectId` - ID subject yang ingin dipelajari
- `scheduledAt` - Waktu mulai les (ISO 8601 format)
- `duration` - Durasi dalam jam (minimum 1)
- `bookingType` - "single" atau "package"
- `numberOfSessions` - Jumlah sesi (untuk package)
- `notes` - Catatan untuk tutor (optional)
- `location` - Lokasi les (optional, untuk offline)
- `teachingMethod` - "online" atau "offline"

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tutorId": "tutor-uuid",
    "subjectId": "subject-uuid",
    "scheduledAt": "2024-12-30T10:00:00.000Z",
    "duration": 2,
    "bookingType": "single",
    "teachingMethod": "online",
    "notes": "Fokus ke trigonometri"
  }'
```

**Response:**
```json
{
  "id": "booking-uuid",
  "studentId": "student-uuid",
  "tutorId": "tutor-uuid",
  "subjectId": "subject-uuid",
  "scheduledAt": "2024-12-30T10:00:00.000Z",
  "duration": 2,
  "bookingType": "single",
  "numberOfSessions": 1,
  "completedSessions": 0,
  "totalAmount": 300000,
  "status": "pending",
  "notes": "Fokus ke trigonometri",
  "teachingMethod": "online",
  "createdAt": "2024-12-29T00:00:00.000Z",
  "student": {
    "id": "student-uuid",
    "fullName": "John Doe",
    "email": "student@example.com",
    "avatarUrl": null
  },
  "tutor": {
    "id": "tutor-uuid",
    "userId": "user-uuid",
    "hourlyRate": 150000,
    "user": {
      "id": "user-uuid",
      "fullName": "Jane Teacher",
      "email": "tutor@example.com",
      "avatarUrl": null
    }
  },
  "subject": {
    "id": "subject-uuid",
    "name": "Matematika",
    "slug": "matematika"
  }
}
```

---

### 2. Get My Bookings
**GET** `/api/bookings`  
**Auth:** Required (JWT Token)

Mendapatkan list booking milik user (sebagai student atau tutor).

**Query Parameters:**
- `status` (optional) - Filter by status: "pending", "confirmed", "completed", "cancelled"
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**cURL Examples:**

**Get all bookings:**
```bash
curl -X GET "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Filter by status:**
```bash
curl -X GET "http://localhost:3000/api/bookings?status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**With pagination:**
```bash
curl -X GET "http://localhost:3000/api/bookings?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "data": [
    {
      "id": "booking-uuid",
      "scheduledAt": "2024-12-30T10:00:00.000Z",
      "duration": 2,
      "totalAmount": 300000,
      "status": "pending",
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
      "subject": {
        "name": "Matematika"
      }
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 3. Get Booking by ID
**GET** `/api/bookings/:id`  
**Auth:** Required (JWT Token)

Mendapatkan detail booking berdasarkan ID.

**cURL Example:**
```bash
curl -X GET "http://localhost:3000/api/bookings/booking-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "booking-uuid",
  "studentId": "student-uuid",
  "tutorId": "tutor-uuid",
  "subjectId": "subject-uuid",
  "scheduledAt": "2024-12-30T10:00:00.000Z",
  "duration": 2,
  "bookingType": "single",
  "numberOfSessions": 1,
  "completedSessions": 0,
  "totalAmount": 300000,
  "status": "pending",
  "notes": "Fokus ke trigonometri",
  "location": null,
  "teachingMethod": "online",
  "createdAt": "2024-12-29T00:00:00.000Z",
  "student": {
    "id": "student-uuid",
    "fullName": "John Doe",
    "email": "student@example.com",
    "avatarUrl": null
  },
  "tutor": {
    "id": "tutor-uuid",
    "user": {
      "fullName": "Jane Teacher",
      "email": "tutor@example.com"
    }
  },
  "subject": {
    "name": "Matematika"
  },
  "payment": null
}
```

---

### 4. Update Booking
**PUT** `/api/bookings/:id`  
**Auth:** Required (JWT Token)  
**Role:** Student (owner only)

Update booking yang masih pending.

**Request Body:** (semua field optional)
```json
{
  "scheduledAt": "2024-12-30T14:00:00.000Z",
  "notes": "Updated notes",
  "location": "Updated location"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "scheduledAt": "2024-12-30T14:00:00.000Z",
    "notes": "Ubah jam jadi sore"
  }'
```

---

### 5. Cancel Booking
**PUT** `/api/bookings/:id/cancel`  
**Auth:** Required (JWT Token)  
**Role:** Student or Tutor

Cancel booking (student atau tutor bisa cancel).

**Request Body:**
```json
{
  "cancellationReason": "Saya ada keperluan mendadak"
}
```

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/cancel" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Ada keperluan mendadak"
  }'
```

**Response:**
```json
{
  "id": "booking-uuid",
  "status": "cancelled",
  "cancellationReason": "Ada keperluan mendadak",
  "cancelledAt": "2024-12-29T10:00:00.000Z",
  "cancelledBy": "user-uuid",
  "isLateCancel": false,
  "refundEligible": true,
  "student": {...},
  "tutor": {...},
  "subject": {...}
}
```

**Cancellation Policy:**
- Cancel > 24 jam sebelum: Full refund
- Cancel < 24 jam sebelum: No refund (late cancel)

---

### 6. Confirm Booking (Tutor Only)
**PUT** `/api/bookings/:id/confirm`  
**Auth:** Required (JWT Token)  
**Role:** Tutor only

Tutor confirm booking yang pending.

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/confirm" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "booking-uuid",
  "status": "confirmed",
  "student": {...},
  "tutor": {...},
  "subject": {...}
}
```

---

### 7. Complete Booking
**PUT** `/api/bookings/:id/complete`  
**Auth:** Required (JWT Token)  
**Role:** Student or Tutor

Mark booking sebagai completed setelah les selesai.

**cURL Example:**
```bash
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/complete" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "id": "booking-uuid",
  "status": "completed",
  "completedSessions": 1,
  "student": {...},
  "tutor": {...},
  "subject": {...}
}
```

---

## 🔄 Booking Status Flow

```
pending → confirmed → completed
   ↓          ↓
cancelled  cancelled
```

**Status Descriptions:**
- **pending** - Booking baru dibuat, menunggu konfirmasi tutor
- **confirmed** - Tutor sudah confirm, les akan berlangsung
- **completed** - Les sudah selesai
- **cancelled** - Booking dibatalkan (student atau tutor)

---

## 🧪 Complete Testing Flow

### Scenario 1: Student Books a Tutor

```bash
# 1. Register as student
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@test.com",
    "password": "Test123456",
    "fullName": "Test Student",
    "role": "student"
  }'

# Save student token

# 2. Search for tutors
curl -X GET "http://localhost:3000/api/tutors/search?subject=Matematika"

# Get tutor ID and subject ID from response

# 3. Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tutorId": "tutor-uuid",
    "subjectId": "subject-uuid",
    "scheduledAt": "2024-12-30T10:00:00.000Z",
    "duration": 2,
    "bookingType": "single",
    "teachingMethod": "online"
  }'

# 4. View my bookings
curl -X GET "http://localhost:3000/api/bookings" \
  -H "Authorization: Bearer STUDENT_TOKEN"
```

### Scenario 2: Tutor Confirms Booking

```bash
# 1. Login as tutor
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "tutor@example.com",
    "password": "Password123"
  }'

# Save tutor token

# 2. View my bookings (as tutor)
curl -X GET "http://localhost:3000/api/bookings?status=pending" \
  -H "Authorization: Bearer TUTOR_TOKEN"

# 3. Confirm booking
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/confirm" \
  -H "Authorization: Bearer TUTOR_TOKEN"
```

### Scenario 3: Complete Booking

```bash
# After the lesson is done, either student or tutor can mark as completed

# As student:
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/complete" \
  -H "Authorization: Bearer STUDENT_TOKEN"

# Or as tutor:
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/complete" \
  -H "Authorization: Bearer TUTOR_TOKEN"
```

### Scenario 4: Cancel Booking

```bash
# Student cancels
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/cancel" \
  -H "Authorization: Bearer STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Ada keperluan mendadak"
  }'

# Or tutor cancels
curl -X PUT "http://localhost:3000/api/bookings/booking-uuid/cancel" \
  -H "Authorization: Bearer TUTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cancellationReason": "Saya sakit"
  }'
```

---

## 📊 Business Rules

### 1. Booking Creation
- ✅ Tutor must be verified
- ✅ Tutor must teach the selected subject
- ✅ Scheduled time must be in the future
- ✅ No conflicting bookings for the tutor
- ✅ Total amount = hourlyRate × duration × numberOfSessions

### 2. Booking Update
- ✅ Only student (owner) can update
- ✅ Can only update pending bookings
- ✅ New scheduled time must not conflict

### 3. Booking Cancellation
- ✅ Both student and tutor can cancel
- ✅ Can only cancel pending or confirmed bookings
- ✅ Cancel > 24h before: Full refund eligible
- ✅ Cancel < 24h before: No refund (late cancel)

### 4. Booking Confirmation
- ✅ Only tutor can confirm
- ✅ Can only confirm pending bookings

### 5. Booking Completion
- ✅ Both student and tutor can mark as completed
- ✅ Can only complete confirmed bookings
- ✅ Increments tutor's totalStudents counter

---

## ⚠️ Error Scenarios

### Tutor Not Found
```json
{
  "statusCode": 404,
  "message": "Tutor not found"
}
```

### Tutor Not Verified
```json
{
  "statusCode": 400,
  "message": "Tutor is not verified yet"
}
```

### Tutor Doesn't Teach Subject
```json
{
  "statusCode": 400,
  "message": "Tutor does not teach this subject"
}
```

### Scheduled Time in Past
```json
{
  "statusCode": 400,
  "message": "Scheduled time must be in the future"
}
```

### Conflicting Booking
```json
{
  "statusCode": 400,
  "message": "Tutor already has a booking at this time"
}
```

### Unauthorized Access
```json
{
  "statusCode": 403,
  "message": "You can only view your own bookings"
}
```

---

## 📝 API Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/bookings` | POST | ✅ | Create booking |
| `/api/bookings` | GET | ✅ | Get my bookings |
| `/api/bookings/:id` | GET | ✅ | Get booking by ID |
| `/api/bookings/:id` | PUT | ✅ | Update booking |
| `/api/bookings/:id/cancel` | PUT | ✅ | Cancel booking |
| `/api/bookings/:id/confirm` | PUT | ✅ | Confirm booking (tutor) |
| `/api/bookings/:id/complete` | PUT | ✅ | Complete booking |

**Total Endpoints:** 7 endpoints  
**All Protected:** Requires authentication

---

## 🎯 Next Steps

1. ✅ Test all Bookings endpoints
2. 🔨 Implement Payments module (Midtrans integration)
3. 🔨 Create booking calendar UI
4. 🔨 Add email notifications
5. 🔨 Add real-time updates (Socket.io)

---

**Happy Testing! 🎉**
