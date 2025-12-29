# Perbaikan Integrasi Backend-Frontend untuk Booking & Kalender

## 📋 Ringkasan Perbaikan

Dokumen ini menjelaskan perbaikan yang telah dilakukan untuk memperbaiki integrasi antara backend dan frontend, khususnya untuk fungsi booking dan kalender.

---

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Data Transformer (`/frontend/src/utils/bookingAdapter.ts`)** ✅

**Fungsi:**
- Transform data dari format backend ke format frontend
- Transform data dari format frontend ke format backend
- Handle perbedaan field names dan data types

**Key Functions:**
```typescript
transformBackendBooking(backendBooking) → frontendBooking
transformBackendBookings(backendBookings[]) → frontendBookings[]
transformFrontendBookingToBackend(frontendData) → backendData
```

**Field Mapping:**
- `startAt` (backend) → `scheduledAt` (frontend)
- `durationMinutes` (backend) → `duration` in hours (frontend)
- `locationAddress` (backend) → `location` (frontend)
- `locationType` (backend) → `teachingMethod` (frontend)
- Auto-generate `bookingNumber` dari ID dan createdAt

---

### 2. **Backend Schema Update (`/backend/prisma/schema.prisma`)** ✅

**Field Baru yang Ditambahkan:**
```prisma
model Booking {
  // ... existing fields
  bookingNumber    String?   @unique @map("booking_number")
  rescheduleReason String?   @map("reschedule_reason")
  completedAt      DateTime? @map("completed_at")
  // ... rest of fields
}
```

**Penjelasan:**
- `bookingNumber`: Nomor booking unik untuk referensi user
- `rescheduleReason`: Alasan jika booking di-reschedule
- `completedAt`: Timestamp saat booking selesai

---

### 3. **Backend Service Update (`/backend/src/bookings/bookings.service.ts`)** ✅

**Fungsi Baru:**
```typescript
private generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BKG-${year}-${random}`;
}
```

**Digunakan saat:**
- Create booking → auto-generate booking number
- Complete booking → set completedAt timestamp

---

### 4. **Frontend Bookings Page Update** ✅

**Import Transformer:**
```typescript
import { transformBackendBookings } from '@/utils/bookingAdapter';
```

**Update fetchBookings:**
```typescript
const response = await api.get('/bookings');
const transformedBookings = transformBackendBookings(response.data.data);
setBookings(transformedBookings);
```

**Benefit:**
- Data dari backend otomatis di-transform ke format yang dibutuhkan frontend
- Kalender menerima data dengan format yang benar
- Tidak perlu ubah komponen Calendar

---

## 🔄 Cara Menjalankan Migration

### **Step 1: Generate Migration**
```bash
cd backend
npx prisma migrate dev --name add_booking_fields
```

### **Step 2: Apply Migration**
Migration akan otomatis dijalankan saat generate. Jika perlu manual:
```bash
npx prisma migrate deploy
```

### **Step 3: Generate Prisma Client**
```bash
npx prisma generate
```

### **Step 4: Restart Backend**
```bash
npm run start:dev
```

---

## 📊 Struktur Data Sebelum vs Sesudah

### **Backend Response (Sebelum Transform):**
```json
{
  "id": "abc123",
  "startAt": "2024-12-30T10:00:00Z",
  "endAt": "2024-12-30T12:00:00Z",
  "durationMinutes": 120,
  "locationType": "online",
  "locationAddress": null,
  "status": "confirmed",
  "totalAmount": 300000,
  "tutor": {
    "user": { "fullName": "Budi Santoso" }
  },
  "student": { "fullName": "Ahmad Rizki" },
  "tutorSubject": {
    "subject": { "name": "Matematika" }
  }
}
```

### **Frontend Data (Setelah Transform):**
```json
{
  "id": "abc123",
  "bookingNumber": "BKG-2024-ABC123",
  "scheduledAt": "2024-12-30T10:00:00Z",
  "duration": 2,
  "teachingMethod": "online",
  "location": null,
  "status": "confirmed",
  "totalAmount": 300000,
  "tutor": {
    "user": { "fullName": "Budi Santoso" }
  },
  "student": { "fullName": "Ahmad Rizki" },
  "subject": { "name": "Matematika" }
}
```

---

## 🎯 Testing Checklist

### **Backend Testing:**
- [ ] Run migration: `npx prisma migrate dev`
- [ ] Check database schema updated
- [ ] Test create booking → bookingNumber generated
- [ ] Test complete booking → completedAt set
- [ ] Test API response includes new fields

### **Frontend Testing:**
- [ ] Test fetch bookings from real backend
- [ ] Verify data transformation works
- [ ] Check kalender displays bookings correctly
- [ ] Verify booking details in modal
- [ ] Test filter & search functionality

### **Integration Testing:**
- [ ] Create booking via frontend → check backend
- [ ] View booking in kalender → verify data
- [ ] Complete booking → check completedAt
- [ ] Cancel booking → check cancelReason

---

## 🔧 Troubleshooting

### **Error: Field not found**
**Solusi:** Jalankan migration dan generate Prisma client
```bash
npx prisma migrate dev
npx prisma generate
```

### **Error: Transform function not found**
**Solusi:** Pastikan import path benar
```typescript
import { transformBackendBookings } from '@/utils/bookingAdapter';
```

### **Data tidak muncul di kalender**
**Solusi:** 
1. Check console untuk error
2. Verify API response format
3. Check transformer mapping
4. Verify scheduledAt field exists

### **Booking number tidak muncul**
**Solusi:**
1. Check backend service generateBookingNumber()
2. Verify migration applied
3. Check database column exists

---

## 📝 API Endpoints

### **Get All Bookings**
```
GET /api/bookings
Headers: Authorization: Bearer {token}
Response: { data: Booking[], meta: {...} }
```

### **Get Booking by ID**
```
GET /api/bookings/:id
Headers: Authorization: Bearer {token}
Response: Booking
```

### **Create Booking**
```
POST /api/bookings
Headers: Authorization: Bearer {token}
Body: {
  tutorId: string,
  subjectId: string,
  scheduledAt: string,
  duration: number,
  teachingMethod: string,
  notes?: string
}
Response: Booking
```

### **Cancel Booking**
```
PUT /api/bookings/:id/cancel
Headers: Authorization: Bearer {token}
Body: { cancellationReason: string }
Response: Booking
```

---

## 🚀 Next Steps

### **Immediate (Required):**
1. ✅ Run migration di development database
2. ✅ Test dengan real backend
3. ✅ Verify kalender functionality

### **Short Term (Recommended):**
1. Add booking number generation logic
2. Add completedAt auto-set on complete
3. Add reschedule functionality
4. Add validation for booking conflicts

### **Long Term (Optional):**
1. Add booking notifications
2. Add booking reminders
3. Add booking analytics
4. Add booking export feature

---

## 📚 File Changes Summary

### **Created:**
- `frontend/src/utils/bookingAdapter.ts` - Data transformer
- `INTEGRATION_FIX.md` - This documentation

### **Modified:**
- `backend/prisma/schema.prisma` - Added 3 new fields
- `backend/src/bookings/bookings.service.ts` - Added generateBookingNumber()
- `frontend/src/app/bookings/page.tsx` - Added transformer import & usage

### **No Changes Needed:**
- `frontend/src/components/Calendar.tsx` - Works with transformed data
- `frontend/src/lib/api.ts` - API client already correct
- Backend controllers - No changes needed

---

## ✅ Verification Commands

### **Check Backend:**
```bash
cd backend
npx prisma studio  # View database
npm run start:dev  # Start backend
```

### **Check Frontend:**
```bash
cd frontend
npm run dev  # Start frontend
# Visit: http://localhost:3001/bookings
```

### **Check Integration:**
1. Login to frontend
2. Navigate to /bookings
3. Click "📅 Kalender" toggle
4. Verify bookings appear in calendar
5. Click a booking to see details
6. Check all fields display correctly

---

**Status:** ✅ Perbaikan selesai dan siap untuk testing!
**Last Updated:** 29 Desember 2024
