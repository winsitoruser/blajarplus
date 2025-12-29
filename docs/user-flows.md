# User Flows & Journey Maps - Blajarplus

## Overview

Dokumentasi lengkap user journey untuk 3 tipe pengguna: **Pelajar (Student)**, **Pengajar (Tutor)**, dan **Admin**.

---

## 🎓 User Flow: Pelajar (Student)

### Flow 0: Landing → Explore (Tanpa Login)

**Goal:** Pelajar menemukan dan mengeksplorasi pengajar tanpa harus mendaftar terlebih dahulu

**Entry Point:** Homepage (`/`)

**Steps:**
1. **Landing Page**
   - Hero section dengan value proposition
   - Search bar: "Mau belajar apa?" + filter Online/Offline + Lokasi
   - Kategori populer (Matematika, Bahasa Inggris, Coding, Musik, dll)
   - Featured tutors
   - Testimonials
   - How it works section

2. **Browse by Category**
   - Klik kategori mata pelajaran
   - Atau klik "Lihat Semua Pengajar"
   - Redirect ke `/search?category=matematika`

3. **Search Results Page**
   - List tutor cards dengan info:
     - Foto profil
     - Nama
     - Rating & jumlah review
     - Harga per jam
     - Subjects & levels
     - Badge "Verified"
     - Mode: Online/Offline
   - Filter sidebar
   - Sort options

4. **View Tutor Profile**
   - Klik tutor card
   - Redirect ke `/tutor/:id`
   - Lihat detail lengkap (tanpa login)

**Success Criteria:**
- User dapat browse minimal 20 tutor tanpa login
- Page load < 2 detik
- Filter berfungsi real-time

**UX Notes (Indonesia):**
- Mayoritas user Indonesia "lihat-lihat dulu" sebelum commit
- Tidak memaksa login terlalu awal
- Trust indicators (verified badge, reviews) harus prominent

---

### Flow 1: Search & Filter Tutors

**Goal:** Mencari pengajar spesifik dengan kriteria tertentu

**Entry Points:**
- Search bar di homepage
- Search bar di navbar (semua halaman)
- Category page

**Steps:**

1. **Input Search Query**
   - Ketik keyword (e.g., "Matematika SMA")
   - Atau pilih dari suggestions dropdown
   - Auto-complete dengan popular searches

2. **View Search Results** (`/search?q=matematika+sma`)
   - Jumlah hasil: "Ditemukan 47 pengajar"
   - Tutor cards grid/list view
   - Default sort: "Paling Cocok"

3. **Apply Filters** (Sidebar)
   
   **Subject Filter:**
   - Checkbox list of subjects
   - Multi-select allowed
   
   **Level Filter:**
   - SD
   - SMP
   - SMA
   - Kuliah
   - Profesional
   - Umum
   
   **Price Range:**
   - Slider: Rp 50k - Rp 500k/jam
   - Input manual min/max
   
   **Location:**
   - Dropdown: Provinsi
   - Dropdown: Kota (dependent)
   - Only for offline mode
   
   **Teaching Mode:**
   - Radio: Online / Offline / Both
   
   **Rating:**
   - Minimum rating slider (1-5 stars)
   - Checkbox: "Verified Only"
   
   **Availability:**
   - Checkbox: Hari ini
   - Checkbox: Weekend
   - Date picker: Tanggal spesifik

4. **Sort Results**
   - Paling Cocok (default - relevance)
   - Rating Tertinggi
   - Harga Termurah
   - Harga Termahal
   - Pengalaman Terbanyak
   - Paling Populer (total students)

5. **View Results**
   - Results update real-time (AJAX)
   - Pagination: 20 per page
   - "Load More" button

6. **Select Tutor**
   - Klik tutor card
   - Redirect ke detail page

**Edge Cases:**
- **No results found:**
  - Show: "Tidak ada hasil untuk '[query]'"
  - Suggestions: "Coba kata kunci lain" atau "Hapus beberapa filter"
  - Show similar tutors
  
- **Network error:**
  - Show error message
  - Retry button
  
- **Invalid filters:**
  - Reset to default
  - Show notification

**Performance:**
- Search results < 1 second
- Filter apply < 500ms
- Cache popular searches

---

### Flow 2: View Tutor Detail & Initiate Contact

**Goal:** Melihat detail lengkap pengajar dan memulai interaksi

**Entry Point:** `/tutor/:id`

**Page Sections:**

#### 1. Header Section
- Profile picture (large)
- Full name
- Headline (e.g., "Tutor IELTS 8.0, 5 tahun pengalaman")
- Rating: ★★★★★ 4.8 (127 reviews)
- Hourly rate: **Rp 150,000/jam**
- Location: Jakarta Selatan
- Teaching mode: Online & Offline
- Badge: "✓ Verified"
- Response rate: 95%
- Response time: < 1 jam

#### 2. Action Buttons
- **Primary:** "Pesan Sekarang" (Book Now)
- **Secondary:** "Chat Tutor" (requires login)
- **Tertiary:** "♡ Simpan" (Favorite)

#### 3. About Section
- Bio/description (max 500 words)
- Education background
- Experience years
- Teaching style
- Languages spoken
- Intro video (optional, YouTube/Vimeo embed)

#### 4. Subjects & Levels
- Table format:
  ```
  Mata Pelajaran    | Level              | Harga
  Matematika        | SMP, SMA           | Rp 150k/jam
  Fisika            | SMA                | Rp 175k/jam
  ```

#### 5. Availability Calendar
- Weekly calendar view
- Color-coded slots:
  - Green: Available
  - Gray: Booked
  - White: Not available
- Click slot to quick book

#### 6. Reviews Section
- Average rating breakdown:
  ```
  5★ ████████████████ 85 (67%)
  4★ ████████░░░░░░░░ 30 (24%)
  3★ ██░░░░░░░░░░░░░░ 10 (8%)
  2★ ░░░░░░░░░░░░░░░░  1 (1%)
  1★ ░░░░░░░░░░░░░░░░  1 (0%)
  ```
- Recent reviews (5 latest)
  - Student name (first name only)
  - Rating
  - Comment
  - Date
  - Tutor response (optional)
- "Lihat Semua Review" button

#### 7. Stats & Achievements
- Total lessons completed: 245
- Total students taught: 89
- Member since: Jan 2023
- Badges: Top Tutor, Quick Responder

**User Actions:**

**A. Chat Tutor**
1. Klik "Chat Tutor"
2. **If not logged in:**
   - Modal: "Login untuk chat dengan tutor"
   - Options: Login / Register
3. **If logged in:**
   - Redirect to chat page
   - Or open chat modal (inline)

**B. Book Now**
1. Klik "Pesan Sekarang"
2. Opens booking modal (see Flow 3)

**C. Favorite**
1. Klik heart icon
2. **If not logged in:** Prompt login
3. **If logged in:** Add to favorites
4. Icon changes to filled heart
5. Toast notification: "Ditambahkan ke favorit"

---

### Flow 3: Booking Process

**Goal:** Melakukan booking lesson dengan tutor

**Entry Point:** 
- "Pesan Sekarang" button on tutor profile
- Available slot on calendar

**Modal/Page:** Booking Form

#### Step 1: Select Date & Time

**UI:**
- Calendar picker (only available dates clickable)
- Blocked dates:
  - Past dates
  - Tutor time-offs
  - Fully booked dates

**Select Time:**
- Dropdown: Available time slots
- Based on tutor availability
- Show timezone: Asia/Jakarta

**Select Duration:**
- Radio buttons:
  - 60 menit (1 jam)
  - 90 menit (1.5 jam)
  - 120 menit (2 jam)
  - Custom (input field)

**Next Button:** Enabled when all selected

#### Step 2: Lesson Details

**Subject:**
- Dropdown: Tutor's subjects
- Auto-populate if came from subject filter

**Level:**
- Dropdown: SD/SMP/SMA/Kuliah/Profesional/Umum

**Teaching Mode:**
- Radio: Online / Offline

**If Online:**
- Info: "Link meeting akan dikirim setelah pembayaran"

**If Offline:**
- **Location Type:**
  - Radio: Tempat Siswa / Tempat Tutor / Tempat Umum
- **Address:**
  - If Tempat Siswa: Input address
  - If Tempat Tutor: Show tutor address
  - If Tempat Umum: Input address

**Notes (Optional):**
- Textarea: "Ada yang ingin disampaikan ke tutor?"
- Max 500 characters

**Next Button**

#### Step 3: Review & Confirm

**Booking Summary:**
```
Tutor: [Name]
Tanggal: Senin, 15 Januari 2024
Waktu: 19:00 - 20:30 WIB
Durasi: 90 menit
Mata Pelajaran: Matematika (SMA)
Mode: Online
```

**Price Breakdown:**
```
Harga per jam:        Rp 150,000
Durasi: 1.5 jam       Rp 225,000
Platform fee (10%):   Rp  22,500
─────────────────────────────────
Total:                Rp 247,500
```

**Terms & Conditions:**
- Checkbox: "Saya setuju dengan [syarat & ketentuan]"

**Buttons:**
- "Kembali" (Back)
- "Lanjut ke Pembayaran" (Proceed to Payment)

#### Step 4: Authentication Check

**If not logged in:**
- Save booking data to session
- Redirect to login/register
- After login, return to payment page

**If logged in:**
- Proceed to payment

---

### Flow 4: Payment Process

**Goal:** Menyelesaikan pembayaran booking

**Page:** `/payment/:bookingId`

**Status:** Booking status = `pending_payment`

#### Payment Page Layout

**Left Column: Booking Summary**
- Tutor info (photo, name)
- Date, time, duration
- Subject & level
- Teaching mode
- Location (if offline)
- Price breakdown

**Right Column: Payment Methods**

**1. Virtual Account**
- BCA
- Mandiri
- BNI
- BRI
- Permata

**2. E-Wallet**
- GoPay
- OVO
- Dana
- ShopeePay
- LinkAja

**3. QRIS**
- Scan QR code

**4. Credit/Debit Card**
- Visa
- Mastercard
- JCB

#### Payment Flow

1. **Select Payment Method**
   - Click payment option
   - Highlight selected
   - Show payment instructions

2. **Confirm Payment**
   - Button: "Bayar Sekarang"
   - Create payment transaction
   - Redirect to payment gateway (Midtrans/Xendit)

3. **Payment Gateway**
   - Complete payment process
   - External provider page

4. **Payment Callback**
   - Webhook from provider
   - Update payment status
   - Update booking status

5. **Payment Success**
   - Redirect to `/payment/success/:bookingId`
   - Show success message
   - Show booking details
   - Show next steps

6. **Payment Failed**
   - Redirect to `/payment/failed/:bookingId`
   - Show error message
   - Show retry button
   - Show alternative payment methods

#### Success Page

**UI:**
- ✓ Success icon (large, green)
- "Pembayaran Berhasil!"
- Booking ID: #BLP-20240115-001
- "Booking Anda telah dikonfirmasi"

**Booking Details:**
- Tutor name & photo
- Date, time, duration
- Subject
- Mode & location/meeting link

**Next Steps:**
- "Chat dengan Tutor" button
- "Lihat Detail Booking" button
- "Kembali ke Dashboard" button

**Notifications Sent:**
- Email to student
- Email to tutor
- In-app notification (both)
- WhatsApp (optional, phase 2)

#### Payment Status & Escrow

**Status Flow:**
1. `pending` → Waiting for payment
2. `paid` → Payment successful, held in escrow
3. `released` → Payment released to tutor (after lesson completed)
4. `refunded` → Payment refunded (if cancelled)

**Escrow Rules:**
- Payment held until lesson completed
- Auto-release 24 hours after lesson end time
- Manual release by student (optional)
- Refund if cancelled > 24h before lesson

---

### Flow 5: Chat with Tutor

**Goal:** Berkomunikasi dengan tutor sebelum/sesudah booking

**Entry Points:**
- "Chat" button on tutor profile
- "Chat dengan Tutor" on booking confirmation
- Dashboard → Messages tab
- Notification → "Reply" button

**Page:** `/messages` or `/messages/:conversationId`

#### Chat Interface

**Layout:**

**Left Sidebar: Conversations List**
- Search conversations
- Filter: All / Unread
- Conversation items:
  - Tutor photo
  - Tutor name
  - Last message preview (truncated)
  - Timestamp
  - Unread badge (count)
  - Online status indicator

**Main Area: Chat Window**

**Header:**
- Tutor photo & name
- Online status: "Online" / "Terakhir dilihat 5m yang lalu"
- Actions:
  - View profile button
  - More menu (Report, Block)

**Message Area:**
- Scrollable message history
- Messages grouped by date
- Message bubbles:
  - Sent (right, blue)
  - Received (left, gray)
- Timestamp on hover
- Read receipts: ✓✓ (sent), ✓✓ (read)

**Input Area:**
- Text input box
- Placeholder: "Ketik pesan..."
- Attachment button (📎)
- Send button (➤)
- Character count (if near limit)

#### Chat Features

**1. Send Text Message**
- Type message
- Press Enter or click Send
- Message appears instantly (optimistic UI)
- Real-time sync via WebSocket

**2. Send Attachment**
- Click attachment button
- File picker opens
- Allowed types: Images (JPG, PNG), PDF
- Max size: 10MB
- Upload progress bar
- Preview before send

**3. Receive Message**
- Real-time notification (if online)
- Push notification (if offline)
- Unread badge updates
- Sound notification (optional)

**4. Quick Actions**
- **Book Lesson:** Quick booking button in chat header
- **View Profile:** Link to tutor profile
- **Report/Block:** From more menu

#### Business Rules

**Access Control:**
- Students can only chat with tutors they've contacted or booked
- First message creates conversation
- Conversation persists indefinitely

**Message Limits:**
- Max message length: 1000 characters
- Max attachments per message: 3
- File size limit: 10MB per file

**Moderation:**
- Messages cannot be deleted (only hidden)
- Report function available
- Admin can view all conversations (for disputes)

**Notifications:**
- Real-time (WebSocket) if online
- Push notification if offline
- Email digest (daily, optional)

---

### Flow 6: Dashboard & Manage Bookings

**Goal:** Mengelola bookings, melihat progress, dan history

**Page:** `/dashboard/student`

**Navigation Tabs:**
1. Overview
2. Bookings
3. Progress
4. Messages
5. Favorites
6. Profile

---

#### Tab 1: Overview

**Welcome Section:**
- "Selamat datang, [Name]!"
- Profile completion: 85% (with CTA to complete)

**Upcoming Lessons:**
- Next 7 days
- Card format:
  - Tutor photo & name
  - Date, time
  - Subject
  - Countdown: "2 hari lagi"
  - Actions: View Details, Chat, Cancel

**Quick Stats:**
- Total lessons completed: 12
- Total hours learned: 18 jam
- Favorite subjects: Matematika, Fisika
- Current streak: 3 minggu 🔥

**Recent Notifications:**
- Last 5 notifications
- "Lihat Semua" link

---

#### Tab 2: Bookings

**Filters:**
- Status: All / Upcoming / Completed / Cancelled
- Date range picker
- Subject filter

**Views:**
- List view (default)
- Calendar view (toggle)

**Booking Cards (List View):**

**Card Layout:**
```
┌─────────────────────────────────────────┐
│ [Tutor Photo]  Nama Tutor               │
│                ★★★★★ 4.8                │
│                                          │
│ 📅 Senin, 15 Jan 2024                   │
│ 🕐 19:00 - 20:30 WIB                    │
│ 📚 Matematika (SMA)                     │
│ 💻 Online                               │
│                                          │
│ Status: [Confirmed]                     │
│                                          │
│ [View Details] [Chat] [Cancel]          │
└─────────────────────────────────────────┘
```

**Status Badges:**
- `pending_payment` → Orange "Menunggu Pembayaran"
- `confirmed` → Green "Dikonfirmasi"
- `completed` → Blue "Selesai"
- `cancelled` → Red "Dibatalkan"
- `no_show` → Gray "Tidak Hadir"

**Actions:**

**View Details:**
- Opens modal with full booking info
- Payment status
- Meeting link (if online)
- Location (if offline)
- Notes
- Progress logs (if any)
- Actions: Chat, Cancel, Review

**Chat:**
- Opens chat with tutor
- Or redirects to messages page

**Cancel:**
- Only if status = `confirmed`
- Only if > 24 hours before lesson
- Opens cancellation modal

**Review:**
- Only if status = `completed`
- Only if not reviewed yet
- Opens review modal

---

#### Tab 3: Progress

**View:** Subject-wise progress cards

**Progress Card:**
```
┌─────────────────────────────────────────┐
│ 📚 Matematika (SMA)                     │
│                                          │
│ Total Lessons: 8                        │
│ Total Hours: 12 jam                     │
│ Average Understanding: ★★★★☆ 4.2        │
│                                          │
│ Topics Covered:                         │
│ • Trigonometri                          │
│ • Limit Fungsi                          │
│ • Turunan                               │
│ • Integral                              │
│                                          │
│ Recent Homework:                        │
│ • Latihan Soal Integral (Due: 20 Jan)  │
│                                          │
│ [View Progress Timeline]                │
└─────────────────────────────────────────┘
```

**Progress Timeline:**
- Chronological list of all lessons
- For each lesson:
  - Date
  - Tutor name
  - Topics covered
  - Understanding level
  - Homework
  - Notes from tutor
  - Attachments

**Export:**
- "Export as PDF" button
- Useful for parents/schools

---

#### Tab 4: Messages

- Full chat interface (see Flow 5)
- List of all conversations
- Unread count badge

---

#### Tab 5: Favorites

**View:** Grid of saved tutors

**Tutor Card:**
- Photo
- Name
- Rating
- Hourly rate
- Subjects
- Actions:
  - View Profile
  - Remove from Favorites

**Empty State:**
- "Belum ada tutor favorit"
- "Mulai cari tutor" button

---

#### Tab 6: Profile

**Sections:**

**1. Personal Information**
- Full name
- Email (verified badge)
- Phone (verified badge)
- Gender
- Birthdate
- Edit button

**2. Addresses**
- List of saved addresses
- Primary address highlighted
- Add new address
- Edit/Delete actions

**3. Account Settings**
- Change password
- Email notifications preferences
- Push notifications preferences
- Language: Bahasa Indonesia / English

**4. Payment Methods**
- Saved payment methods (if any)
- Add new payment method

**5. Danger Zone**
- Deactivate account
- Delete account

---

### Flow 7: Cancel Booking

**Goal:** Membatalkan booking dengan refund policy

**Entry Point:** "Cancel" button on booking detail

**Cancellation Modal:**

**Header:**
- "Batalkan Booking?"
- Warning icon

**Booking Info:**
- Tutor name
- Date, time
- Subject

**Refund Policy:**
- ✓ Dibatalkan > 24 jam sebelum: **Full refund**
- ⚠ Dibatalkan < 24 jam sebelum: **50% refund**
- ✗ Dibatalkan < 2 jam sebelum: **No refund**

**Current Status:**
- Show applicable refund amount
- "Anda akan menerima refund: Rp 247,500"

**Cancellation Reason:**
- Dropdown:
  - Berubah pikiran
  - Jadwal bentrok
  - Menemukan tutor lain
  - Harga terlalu mahal
  - Lainnya (input text)

**Confirmation:**
- Checkbox: "Saya yakin ingin membatalkan"

**Buttons:**
- "Batal" (Close modal)
- "Ya, Batalkan Booking" (Confirm, red button)

**After Cancellation:**
- Booking status → `cancelled`
- Refund processed (if applicable)
- Notification sent to tutor
- Email confirmation
- Slot becomes available again

---

### Flow 8: Review Tutor

**Goal:** Memberikan review setelah lesson selesai

**Entry Point:**
- "Review" button on completed booking
- Notification reminder (24h after lesson)

**Review Modal:**

**Header:**
- "Review Tutor"
- Tutor photo & name

**Rating:**
- 5-star rating (required)
- Click to select
- Hover descriptions:
  - 1★ Sangat Buruk
  - 2★ Buruk
  - 3★ Cukup
  - 4★ Baik
  - 5★ Sangat Baik

**Comment:**
- Textarea (optional)
- Placeholder: "Bagaimana pengalaman Anda dengan tutor ini?"
- Max 500 characters
- Character counter

**Tips for Good Review:**
- Helpful bullet points
- "Jelaskan apa yang Anda sukai"
- "Berikan feedback konstruktif"

**Buttons:**
- "Batal"
- "Kirim Review"

**After Submit:**
- Review saved (status: `published`)
- Tutor notified
- Review appears on tutor profile
- Toast: "Terima kasih atas review Anda!"

**Business Rules:**
- 1 booking = 1 review (enforced)
- Cannot edit after submit (contact support)
- Can be hidden by admin (if inappropriate)

---

## 👨‍🏫 User Flow: Pengajar (Tutor)

### Flow 1: Registration & Profile Setup

**Goal:** Mendaftar sebagai tutor dan melengkapi profil

**Entry Point:** Homepage → "Daftar Sebagai Pengajar"

**Page:** `/register/tutor`

---

#### Step 1: Basic Information

**Form Fields:**
- Full Name (required)
- Email (required, unique)
- Phone (required, unique, with OTP verification)
- Password (required, min 8 chars, 1 uppercase, 1 number)
- Confirm Password (required)

**Terms:**
- Checkbox: "Saya setuju dengan [Syarat & Ketentuan] dan [Kebijakan Privasi]"

**Button:** "Lanjutkan"

**Validation:**
- Email format check
- Phone format check (Indonesian numbers)
- Password strength indicator
- Real-time validation

---

#### Step 2: Teaching Information

**Headline:**
- Input: "Tutor [Subject] [Achievement/Experience]"
- Example: "Tutor IELTS 8.0, 5 tahun pengalaman"
- Max 100 characters

**Subjects:**
- Multi-select dropdown
- Categories: Akademik, Bahasa, Skill, Hobi, Profesional
- Can select multiple subjects

**For Each Subject:**
- Levels (checkboxes):
  - SD
  - SMP
  - SMA
  - Kuliah
  - Profesional
  - Umum

**Teaching Mode:**
- Checkboxes (can select multiple):
  - Online
  - Offline

**If Offline selected:**
- Location:
  - Dropdown: Provinsi
  - Dropdown: Kota

**Hourly Rate:**
- Input: Rp [amount]
- Slider: Rp 50k - Rp 500k
- Info: "Platform fee 10% akan dipotong dari pendapatan Anda"

**Button:** "Lanjutkan"

---

#### Step 3: About You

**Profile Picture:**
- Upload image
- Crop tool
- Max 5MB
- Formats: JPG, PNG
- Recommended: 500x500px

**Bio:**
- Textarea
- Placeholder: "Ceritakan tentang diri Anda, pengalaman mengajar, dan metode pengajaran Anda"
- Max 500 words
- Rich text editor (bold, italic, lists)

**Education Background:**
- Input: University/Institution
- Input: Degree
- Input: Year

**Experience Years:**
- Number input
- "Berapa tahun pengalaman mengajar Anda?"

**Teaching Style:**
- Textarea
- "Bagaimana gaya mengajar Anda?"
- Max 200 words

**Languages:**
- Multi-select: Bahasa Indonesia, English, Mandarin, dll

**Intro Video (Optional):**
- YouTube/Vimeo URL
- Or upload video (max 50MB, max 2 minutes)

**Button:** "Lanjutkan"

---

#### Step 4: Verification Documents

**Info:**
- "Untuk menjadi tutor terverifikasi, upload dokumen berikut:"
- "Dokumen akan direview dalam 1-3 hari kerja"

**Required Documents:**

**1. ID Card (KTP)**
- Upload image
- Max 5MB
- Clear, readable photo

**2. Education Certificate**
- Upload image/PDF
- Ijazah/Transkrip/Sertifikat
- Max 5MB

**Optional Documents:**

**3. Teaching Certificate**
- Sertifikat mengajar (if any)

**4. Portfolio/Credentials**
- Achievements, awards, publications
- Max 3 files

**Privacy Note:**
- "Dokumen Anda aman dan hanya akan dilihat oleh tim verifikasi"

**Buttons:**
- "Lewati (Verifikasi Nanti)"
- "Submit untuk Review"

---

#### Step 5: Review & Submit

**Profile Preview:**
- Show how profile will look to students
- All sections visible
- Edit buttons for each section

**Checklist:**
- ✓ Informasi dasar lengkap
- ✓ Mata pelajaran & harga sudah diatur
- ✓ Profil & bio sudah diisi
- ⚠ Dokumen verifikasi belum diupload (optional)

**Button:** "Buat Profil Tutor"

---

#### Step 6: Pending Verification

**Success Page:**
- ✓ Success icon
- "Profil Berhasil Dibuat!"
- "Selamat datang di Blajarplus, [Name]!"

**Status:**
- Profile status: `draft` or `pending` (if docs uploaded)
- "Profil Anda sedang direview"
- Estimated time: 1-3 hari kerja

**Next Steps:**
- "Set Availability" button → Set jadwal mengajar
- "Complete Profile" button → Add more info
- "Go to Dashboard" button

**Email Sent:**
- Welcome email
- Verification status
- Next steps guide

---

#### Verification Result

**If Approved:**
- Email notification: "Selamat! Profil Anda telah diverifikasi"
- In-app notification
- Badge: "✓ Verified" on profile
- Profile status: `active`
- Can now receive bookings

**If Rejected:**
- Email notification with reason
- In-app notification
- Profile status: `draft`
- Option to resubmit with corrections
- Contact support button

---

### Flow 2: Set Availability & Calendar

**Goal:** Mengatur jadwal ketersediaan mengajar

**Page:** `/dashboard/tutor/availability`

---

#### Availability Management

**View:** Weekly calendar grid

**Calendar UI:**
```
        Mon   Tue   Wed   Thu   Fri   Sat   Sun
08:00   [ ]   [ ]   [ ]   [ ]   [ ]   [✓]   [✓]
09:00   [ ]   [ ]   [ ]   [ ]   [ ]   [✓]   [✓]
10:00   [✓]   [✓]   [✓]   [✓]   [✓]   [✓]   [✓]
...
19:00   [✓]   [✓]   [✓]   [✓]   [✓]   [ ]   [ ]
20:00   [✓]   [✓]   [✓]   [✓]   [✓]   [ ]   [ ]
```

**Legend:**
- ✓ Available (green)
- ✗ Booked (gray)
- ○ Blocked (red)

---

#### Add Availability

**Button:** "Tambah Jadwal"

**Modal:**

**Select Days:**
- Checkboxes: Mon, Tue, Wed, Thu, Fri, Sat, Sun
- Or "Select All Weekdays" / "Select Weekend"

**Time Range:**
- Start time: Dropdown (00:00 - 23:00)
- End time: Dropdown (01:00 - 24:00)
- Validation: End > Start

**Slot Duration:**
- Radio buttons:
  - 60 minutes (default)
  - 90 minutes
  - 120 minutes

**Repeat:**
- Checkbox: "Ulangi setiap minggu"
- If checked: Applies to all future weeks
- If unchecked: One-time availability

**Buttons:**
- "Batal"
- "Simpan Jadwal"

**After Save:**
- Calendar updates
- Green slots appear
- Toast: "Jadwal berhasil ditambahkan"

---

#### Edit Availability

**Action:** Click existing slot

**Modal:**
- Show current settings
- Edit time range
- Edit days
- Toggle active/inactive

**Buttons:**
- "Hapus" (Delete)
- "Batal"
- "Simpan Perubahan"

**Validation:**
- Cannot delete slots with confirmed bookings
- Can only deactivate

---

#### Block Dates (Time Off)

**Button:** "Blokir Tanggal"

**Modal:**

**Date Range:**
- Start date: Date picker
- End date: Date picker

**Reason (Optional):**
- Dropdown:
  - Liburan
  - Sakit
  - Acara keluarga
  - Lainnya (input text)

**Affect:**
- "Semua slot di tanggal ini akan diblokir"
- Show count: "12 slot akan diblokir"

**Buttons:**
- "Batal"
- "Blokir Tanggal"

**After Block:**
- Slots turn red
- Not bookable by students
- Can be unblocked anytime

---

#### Auto-sync with Bookings

**Behavior:**
- When booking confirmed → Slot automatically marked as booked
- When booking cancelled → Slot becomes available again
- Real-time updates via WebSocket

**Conflict Prevention:**
- Double-booking not possible
- Slot locking during booking process

---

### Flow 3: Receive & Manage Bookings

**Goal:** Menerima dan mengelola booking dari students

**Page:** `/dashboard/tutor/bookings`

---

#### New Booking Notification

**Channels:**
- Push notification (browser/mobile)
- Email notification
- In-app notification badge
- Sound alert (optional)

**Notification Content:**
- "Booking baru dari [Student Name]!"
- Subject, date, time
- "Lihat Detail" button

---

#### View Booking Request

**Booking Card:**
```
┌─────────────────────────────────────────┐
│ NEW BOOKING REQUEST                     │
│                                          │
│ [Student Photo]  Student Name           │
│                  Member since Jan 2024  │
│                                          │
│ 📅 Senin, 15 Jan 2024                   │
│ 🕐 19:00 - 20:30 WIB (90 menit)         │
│ 📚 Matematika (SMA)                     │
│ 💻 Online                               │
│                                          │
│ Student Notes:                          │
│ "Saya ingin belajar tentang integral"  │
│                                          │
│ Earnings: Rp 202,500                    │
│ (Rp 225,000 - 10% platform fee)        │
│                                          │
│ [Terima] [Tolak]                        │
└─────────────────────────────────────────┘
```

---

#### Accept Booking

**Action:** Click "Terima"

**Confirmation Modal:**
- "Terima booking ini?"
- Show booking details
- "Pastikan Anda tersedia di waktu ini"

**Buttons:**
- "Batal"
- "Ya, Terima"

**After Accept:**
- Booking status → `confirmed`
- Student notified (email + in-app)
- Calendar updated
- Payment released from pending
- Toast: "Booking dikonfirmasi!"

**Auto-actions:**
- If online: Meeting link generated (Zoom/Google Meet)
- If offline: Location confirmed
- Reminder set (H-1, H-3 hours, H-30 minutes)

---

#### Decline Booking

**Action:** Click "Tolak"

**Modal:**

**Reason (Required):**
- Dropdown:
  - Jadwal bentrok
  - Tidak tersedia
  - Di luar area mengajar
  - Tidak sesuai keahlian
  - Lainnya (input text)

**Message to Student (Optional):**
- Textarea
- "Sampaikan pesan ke student (opsional)"
- Max 200 characters

**Warning:**
- "Terlalu sering menolak booking dapat mempengaruhi rating Anda"

**Buttons:**
- "Batal"
- "Ya, Tolak Booking"

**After Decline:**
- Booking status → `cancelled`
- Student notified
- Full refund processed
- Slot becomes available again
- Decline count tracked (for analytics)

---

#### Dashboard Views

**Filter Tabs:**
- All
- Pending (needs action)
- Today
- Upcoming (next 7 days)
- Completed
- Cancelled

**Sort Options:**
- Date (nearest first)
- Date (farthest first)
- Price (highest first)

**Calendar View:**
- Toggle to calendar
- Color-coded bookings
- Click to view details

---

#### Prepare for Lesson

**Before Lesson (H-1):**

**Checklist:**
- ✓ Review student notes
- ✓ Prepare materials
- ✓ Test meeting link (if online)
- ✓ Confirm location (if offline)

**Actions:**
- "Chat Student" button
- "View Student Profile" button
- "Reschedule" button (if needed)

**If Online:**
- "Test Meeting Link" button
- Zoom/Google Meet link visible
- "Copy Link" button

**If Offline:**
- Show location on map
- "Get Directions" button
- Student contact number

---

#### During Lesson

**Status:** Can mark as "In Progress" (optional)

**Quick Access:**
- Student info
- Lesson materials
- Chat
- Notes (for progress log)

---

#### After Lesson

**Action:** Mark as "Completed"

**Modal:**
- "Tandai lesson sebagai selesai?"
- "Jangan lupa isi Progress Log"

**Buttons:**
- "Batal"
- "Tandai Selesai"

**After Complete:**
- Booking status → `completed`
- Prompt to add progress log (see Flow 5)
- Payment released from escrow
- Earnings updated
- Student prompted to review

---

### Flow 4: Chat with Students

**Goal:** Berkomunikasi dengan students

**Similar to Student Chat Flow, but from tutor perspective**

**Entry Points:**
- Booking detail → "Chat" button
- Dashboard → Messages tab
- Notification → "Reply" button

**Features:**
- Real-time messaging
- Conversation history
- Quick replies (templates):
  - "Terima kasih sudah booking!"
  - "Saya confirm untuk [date] jam [time]"
  - "Apakah ada materi khusus yang ingin dipelajari?"
  - "Link meeting: [link]"
- Attachment support
- Online/offline status

**Quick Actions:**
- View student profile
- View related bookings
- Schedule new lesson

---

### Flow 5: Add Progress Log (Unique Feature)

**Goal:** Mendokumentasikan progress belajar student

**Entry Point:**
- After lesson completed
- Dashboard → Bookings → "Tambah Progress Log"

**Page:** `/dashboard/tutor/progress/add/:bookingId`

---

#### Progress Log Form

**Lesson Info (Auto-filled):**
- Date, time, duration
- Student name
- Subject

**Topics Covered:**
- Textarea or tag input
- "Apa yang dipelajari hari ini?"
- Examples: "Trigonometri", "Limit Fungsi", "Turunan"
- Can add multiple topics

**Or Select from Predefined:**
- Dropdown: Common topics for the subject
- Checkbox list

**Student Understanding Level:**
- Rating scale 1-5 (required)
- Visual: ★★★★★
- Labels:
  - 1★ Perlu banyak perbaikan
  - 2★ Perlu perbaikan
  - 3★ Cukup
  - 4★ Baik
  - 5★ Sangat baik

**Homework Assigned:**
- Textarea
- "PR atau tugas untuk student"
- Max 500 characters
- Attach files (optional):
  - PDF, images
  - Max 5 files, 10MB each

**Notes & Observations:**
- Textarea (required)
- "Catatan untuk student dan orang tua"
- Sections:
  - Strengths (Kelebihan)
  - Areas for Improvement (Yang perlu ditingkatkan)
  - Recommendations (Rekomendasi)
- Max 1000 characters

**Attachments:**
- Upload lesson materials
- Upload photos of student work
- Upload practice problems
- Max 5 files, 10MB each

**Buttons:**
- "Simpan sebagai Draft"
- "Simpan & Kirim ke Student"

---

#### After Submit

**Actions:**
- Progress log saved
- Student notified (email + in-app)
- Log visible in student dashboard
- Parents can view (if applicable)

**Toast:** "Progress log berhasil disimpan!"

---

#### View Progress History

**Page:** `/dashboard/tutor/students/:studentId`

**View:**
- List of all lessons with this student
- For each lesson:
  - Date
  - Subject
  - Topics covered
  - Understanding level
  - Homework
  - Notes
  - Attachments

**Analytics:**
- Progress chart over time
- Understanding level trend
- Topics mastered
- Areas needing focus

**Export:**
- "Export as PDF" button
- Useful for student reports

---

### Flow 6: Earnings & Withdrawals

**Goal:** Melihat pendapatan dan melakukan penarikan

**Page:** `/dashboard/tutor/earnings`

---

#### Earnings Overview

**Summary Cards:**

**1. Total Earnings**
- Rp 5,450,000
- "Total pendapatan Anda"

**2. Available Balance**
- Rp 1,200,000
- "Dapat ditarik"
- "Tarik Dana" button

**3. Pending**
- Rp 450,000
- "Dalam escrow (akan dirilis setelah lesson selesai)"

**4. This Month**
- Rp 2,100,000
- "+25% dari bulan lalu"

---

#### Earnings Chart

**Graph:**
- Line/bar chart
- Last 6 months
- Monthly earnings

**Filter:**
- Date range picker
- Subject filter
- Student filter

---

#### Transaction History

**Table:**

| Date       | Student      | Subject      | Duration | Amount    | Fee      | Net       | Status    |
|------------|--------------|--------------|----------|-----------|----------|-----------|-----------|
| 15 Jan 24  | John Doe     | Matematika   | 90 min   | Rp 225k   | Rp 22.5k | Rp 202.5k | Released  |
| 14 Jan 24  | Jane Smith   | Fisika       | 60 min   | Rp 175k   | Rp 17.5k | Rp 157.5k | Pending   |

**Actions:**
- View booking detail
- Download invoice
- Export as CSV

**Pagination:** 20 per page

---

#### Withdrawal

**Minimum:** Rp 100,000

**Button:** "Tarik Dana"

**Modal:**

**Available Balance:**
- Rp 1,200,000

**Withdrawal Amount:**
- Input: Rp [amount]
- Slider
- Max button

**Withdrawal Method:**
- Radio buttons:
  - Bank Transfer
  - E-wallet (GoPay, OVO, Dana)

**If Bank Transfer:**
- Select bank: BCA, Mandiri, BNI, BRI, etc
- Account number
- Account holder name
- (Save for future use checkbox)

**If E-wallet:**
- Select provider
- Phone number
- (Save for future use checkbox)

**Fee:**
- Bank transfer: Free
- E-wallet: Rp 2,500

**Net Amount:**
- "Anda akan menerima: Rp 1,200,000"

**Processing Time:**
- "1-3 hari kerja"

**Buttons:**
- "Batal"
- "Tarik Dana"

---

#### After Withdrawal Request

**Confirmation:**
- "Permintaan penarikan berhasil!"
- Withdrawal ID: #WD-20240115-001
- "Dana akan diproses dalam 1-3 hari kerja"

**Status Tracking:**
- Pending
- Processing
- Completed
- Failed (with reason)

**Notifications:**
- Email confirmation
- In-app notification when completed

---

#### Payment Settings

**Page:** `/dashboard/tutor/payment-settings`

**Saved Payment Methods:**
- List of saved bank accounts / e-wallets
- Edit / Delete actions
- Set default

**Add New Method:**
- "Tambah Metode Pembayaran" button

**Tax Information:**
- NPWP (optional)
- For tax reporting purposes
- "Mengapa perlu NPWP?" info

---

## 👤 User Flow: Admin

### Flow 1: Tutor Verification

**Goal:** Mereview dan memverifikasi tutor baru

**Page:** `/admin/verification`

---

#### Verification Queue

**View:** List of pending verifications

**Filter:**
- Status: Pending / Approved / Rejected
- Date submitted
- Subject category

**Sort:**
- Oldest first (default)
- Newest first

**Tutor Card:**
```
┌─────────────────────────────────────────┐
│ [Photo]  Nama Tutor                     │
│          Submitted: 2 days ago          │
│                                          │
│ Subjects: Matematika, Fisika            │
│ Experience: 5 years                     │
│ Location: Jakarta                       │
│                                          │
│ Documents:                              │
│ ✓ KTP                                   │
│ ✓ Education Certificate                 │
│ ✓ Teaching Certificate                  │
│                                          │
│ [Review]                                │
└─────────────────────────────────────────┘
```

---

#### Review Documents

**Page:** `/admin/verification/:tutorId`

**Tutor Profile Preview:**
- All profile information
- As students will see it

**Documents Section:**

**For Each Document:**
- Document type
- Image/PDF viewer
- Zoom, rotate, download
- Status: Pending / Approved / Rejected

**Verification Checklist:**
- ☐ ID matches profile name
- ☐ Education certificate is valid
- ☐ Teaching certificate is authentic (if provided)
- ☐ Profile information is complete
- ☐ No red flags

**Notes:**
- Textarea for internal notes
- Visible to other admins

---

#### Approve Tutor

**Action:** Click "Approve"

**Confirmation Modal:**
- "Approve tutor [Name]?"
- "Tutor akan mendapat badge 'Verified'"

**Buttons:**
- "Batal"
- "Ya, Approve"

**After Approve:**
- Tutor status → `verified`
- Badge added to profile
- Email sent to tutor
- In-app notification
- Profile becomes `active`
- Audit log created

---

#### Reject Tutor

**Action:** Click "Reject"

**Modal:**

**Reason (Required):**
- Checkboxes (can select multiple):
  - Dokumen tidak jelas
  - Informasi tidak sesuai
  - Sertifikat tidak valid
  - Profil tidak lengkap
  - Lainnya (input text)

**Message to Tutor:**
- Textarea
- "Jelaskan apa yang perlu diperbaiki"
- Will be sent to tutor

**Buttons:**
- "Batal"
- "Ya, Reject"

**After Reject:**
- Tutor status → `rejected`
- Email sent with reason
- Tutor can resubmit
- Audit log created

---

### Flow 2: Monitoring Bookings & Payments

**Goal:** Monitor transaksi dan handle disputes

**Page:** `/admin/bookings`

---

#### Bookings Dashboard

**Stats:**
- Total bookings today: 45
- Total revenue today: Rp 12,500,000
- Pending payments: 12
- Active disputes: 3

**Filters:**
- Date range
- Status
- Subject
- Tutor
- Student

**Bookings Table:**

| ID      | Date       | Student   | Tutor     | Subject   | Amount    | Status    | Actions |
|---------|------------|-----------|-----------|-----------|-----------|-----------|---------|
| #001    | 15 Jan 24  | John Doe  | Jane T.   | Math      | Rp 225k   | Confirmed | View    |
| #002    | 15 Jan 24  | Alice S.  | Bob T.    | English   | Rp 175k   | Disputed  | Resolve |

**Actions:**
- View details
- Resolve dispute
- Refund
- Cancel

---

#### Resolve Dispute

**Entry:** Booking with status `disputed`

**Dispute Info:**
- Reported by: Student / Tutor
- Reason: [reason text]
- Date reported: [date]
- Evidence: [attachments]

**Investigation:**
- View chat history
- View booking details
- View progress logs
- View payment status

**Actions:**
- Refund to student (full/partial)
- Release payment to tutor
- Cancel booking
- Warn user
- Ban user (if fraud)

**Resolution Form:**
- Decision: Dropdown
- Reason: Textarea
- Action taken: Checkboxes
- Internal notes: Textarea

**Buttons:**
- "Simpan & Notify Parties"

**After Resolution:**
- Status updated
- Parties notified
- Audit log created

---

### Flow 3: Content Moderation

**Goal:** Moderate reviews, messages, and user-generated content

**Page:** `/admin/moderation`

---

#### Reported Content Queue

**Tabs:**
- Reviews
- Messages
- Profiles
- All

**Report Card:**
```
┌─────────────────────────────────────────┐
│ REPORTED REVIEW                         │
│                                          │
│ Reported by: John Doe                   │
│ Reason: Inappropriate content           │
│ Date: 15 Jan 2024                       │
│                                          │
│ Review:                                 │
│ "This tutor is terrible..."             │
│ Rating: 1★                              │
│                                          │
│ Tutor: Jane Teacher                     │
│                                          │
│ [View Context] [Take Action]            │
└─────────────────────────────────────────┘
```

---

#### Moderate Review

**Actions:**
- **Keep:** Review is fine, dismiss report
- **Hide:** Hide from public, keep in database
- **Delete:** Permanently remove
- **Warn User:** Send warning to reviewer
- **Ban User:** Ban reviewer (if spam/abuse)

**Reason:**
- Textarea for decision reason
- Will be logged

**After Action:**
- Review status updated
- Reporter notified
- Reviewer notified (if warned/banned)
- Audit log created

---

## Edge Cases & Business Rules

### Cancellation Policy

**Student Cancels:**
- **> 24 hours before:** Full refund (100%)
- **< 24 hours before:** Partial refund (50%)
- **< 2 hours before:** No refund (0%)
- **No-show:** No refund, tutor gets full payment

**Tutor Cancels:**
- **> 24 hours before:** Student gets full refund, tutor warned
- **< 24 hours before:** Student gets full refund, tutor penalized
- **No-show:** Student gets full refund + credit, tutor banned

### Payment Escrow

**Flow:**
1. Student pays → Status: `paid`, held in escrow
2. Lesson completed → Status: `released`, payment to tutor
3. Auto-release: 24 hours after lesson end (if no dispute)
4. Manual release: Student can release early (optional)

**Dispute:**
- Student/tutor can open dispute within 48 hours after lesson
- Payment held until resolved
- Admin investigates and decides

### Quality Control

**Tutor Metrics:**
- Acceptance rate: % of bookings accepted
- Cancellation rate: % of bookings cancelled by tutor
- Response time: Average time to respond to messages
- Rating: Average rating from students

**Penalties:**
- Low acceptance rate (< 80%): Warning
- High cancellation rate (> 10%): Suspension
- Multiple no-shows: Permanent ban
- Low rating (< 3.5): Profile hidden

**Rewards:**
- High rating (> 4.8): "Top Tutor" badge
- Quick response (< 1 hour): "Quick Responder" badge
- 100+ lessons: "Experienced" badge

---

## Site Map

```
Public Pages
├── / (Homepage)
├── /search (Search Results)
├── /tutor/:id (Tutor Profile)
├── /how-it-works
├── /pricing
├── /faq
├── /about
└── /contact

Auth
├── /login
├── /register
│   ├── /register/student
│   └── /register/tutor
├── /forgot-password
└── /reset-password

Student Dashboard
├── /dashboard/student
│   ├── /overview
│   ├── /bookings
│   ├── /progress
│   ├── /messages
│   ├── /favorites
│   └── /profile
├── /booking/:id
├── /payment/:bookingId
└── /payment/success/:bookingId

Tutor Dashboard
├── /dashboard/tutor
│   ├── /overview
│   ├── /bookings
│   ├── /availability
│   ├── /earnings
│   ├── /messages
│   ├── /profile
│   ├── /verification
│   └── /reviews
├── /dashboard/tutor/students/:studentId
└── /dashboard/tutor/progress/add/:bookingId

Admin Panel
├── /admin
│   ├── /dashboard
│   ├── /users
│   ├── /tutors
│   ├── /verification
│   ├── /bookings
│   ├── /payments
│   ├── /moderation
│   ├── /reports
│   ├── /categories
│   └── /settings
└── /admin/verification/:tutorId

Messages
├── /messages
└── /messages/:conversationId
```

---

## Next Steps

This comprehensive user flow documentation covers all major journeys for Students, Tutors, and Admins. The flows are designed with Indonesian user behavior in mind:

1. **Trust-first approach** - Verification badges, reviews, escrow
2. **Chat before commit** - Allow communication before booking
3. **Transparent pricing** - Clear breakdown of fees
4. **Mobile-first** - All flows optimized for mobile
5. **Progress tracking** - Unique differentiator vs competitors

Ready for:
- UI/UX wireframing
- Frontend development
- Backend API implementation
- User testing
