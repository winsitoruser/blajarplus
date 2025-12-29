# Manual Migration Guide - Database Authentication Issue

## ⚠️ Masalah Database Authentication

Migration otomatis gagal karena masalah autentikasi PostgreSQL. Berikut cara mengatasi dan menjalankan migration secara manual.

---

## 🔧 Solusi 1: Fix Password PostgreSQL

### **Cek Password PostgreSQL yang Benar**

1. Buka **pgAdmin** atau **PostgreSQL Command Line**
2. Test koneksi dengan password yang berbeda
3. Password yang mungkin:
   - `jakarta123` (sesuai info sebelumnya)
   - `postgres` (default)
   - Password lain yang Anda set saat install

### **Update File .env**

Edit file `backend/.env` dan update DATABASE_URL:

```env
DATABASE_URL="postgresql://postgres:PASSWORD_ANDA@localhost:5432/blajarplus?schema=public"
```

Ganti `PASSWORD_ANDA` dengan password PostgreSQL yang benar.

### **Test Koneksi**

```bash
cd backend
npx prisma db pull
```

Jika berhasil, lanjut ke migration.

---

## 🔧 Solusi 2: Reset Password PostgreSQL

### **Windows:**

1. Buka **pgAdmin**
2. Right-click pada server PostgreSQL
3. Properties → Connection
4. Reset password untuk user `postgres`

### **Atau via Command Line:**

```bash
# Masuk sebagai superuser
psql -U postgres

# Set password baru
ALTER USER postgres PASSWORD 'jakarta123';
\q
```

---

## 🔧 Solusi 3: Jalankan Migration Manual (SQL)

Jika masih gagal, jalankan SQL migration secara manual:

### **Step 1: Buka pgAdmin atau psql**

```bash
psql -U postgres -d blajarplus
```

### **Step 2: Jalankan SQL Berikut**

```sql
-- Add new columns to bookings table
ALTER TABLE bookings 
ADD COLUMN booking_number VARCHAR UNIQUE,
ADD COLUMN reschedule_reason TEXT,
ADD COLUMN completed_at TIMESTAMP;

-- Create index for booking_number
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);

-- Verify changes
\d bookings
```

### **Step 3: Generate Prisma Client**

```bash
cd backend
npx prisma generate
```

---

## ✅ Solusi 4: Skip Migration & Test dengan Mock Data

**Untuk sementara, Anda bisa skip migration dan test frontend dengan mock data:**

### **Frontend sudah siap dengan:**
- ✅ Data transformer (`bookingAdapter.ts`)
- ✅ Mock data fallback di halaman bookings
- ✅ Kalender component yang berfungsi
- ✅ Filter & search

### **Test Frontend:**

```bash
cd frontend
npm run dev
```

Buka: http://localhost:3001/bookings

**Fitur yang bisa ditest tanpa backend:**
- ✅ View bookings list
- ✅ Toggle ke calendar view
- ✅ Filter by status
- ✅ Search bookings
- ✅ View booking details
- ✅ Navigasi kalender

---

## 🔍 Troubleshooting Database

### **Cek PostgreSQL Service Running**

```powershell
Get-Service -Name postgresql*
```

Jika tidak running:
```powershell
Start-Service postgresql-x64-18
```

### **Cek Port 5432**

```powershell
netstat -an | findstr :5432
```

### **Cek Database Exists**

```bash
psql -U postgres -l
```

Jika database `blajarplus` tidak ada:
```bash
psql -U postgres -c "CREATE DATABASE blajarplus;"
```

---

## 📝 Langkah Selanjutnya

### **Opsi A: Fix Database & Run Migration**
1. Fix password PostgreSQL
2. Update `.env` dengan password yang benar
3. Run: `npx prisma migrate dev --name add_booking_fields`
4. Run: `npx prisma generate`
5. Restart backend: `npm run start:dev`

### **Opsi B: Manual SQL Migration**
1. Jalankan SQL script di atas via pgAdmin/psql
2. Run: `npx prisma generate`
3. Restart backend: `npm run start:dev`

### **Opsi C: Test Frontend Dulu**
1. Skip migration untuk sementara
2. Test frontend dengan mock data
3. Verify semua fitur UI berfungsi
4. Fix database nanti

---

## ✅ Yang Sudah Siap (Tanpa Migration)

**Frontend:**
- ✅ Bookings page dengan list & calendar view
- ✅ Data transformer untuk backend integration
- ✅ Mock data fallback
- ✅ Filter, search, dan modal detail
- ✅ Kalender dengan navigasi bulan
- ✅ Color coding by status

**Backend (Perlu Migration):**
- ⚠️ Schema updated (perlu apply ke database)
- ⚠️ Service updated (perlu migration)
- ⚠️ Generate booking number (perlu migration)

---

## 🎯 Rekomendasi

**Untuk Development Sekarang:**
1. Test frontend dengan mock data terlebih dahulu
2. Verify semua fitur UI berfungsi dengan baik
3. Fix database password secara terpisah
4. Run migration setelah database fix

**Command untuk Test Frontend:**
```bash
cd frontend
npm run dev
# Buka: http://localhost:3001/bookings
# Toggle ke calendar view
# Test semua fitur
```

---

**Note:** Semua perbaikan integrasi sudah selesai di kode. Hanya perlu apply migration ke database saat database sudah bisa diakses.
