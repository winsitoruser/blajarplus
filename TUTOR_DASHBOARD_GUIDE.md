# Dashboard Tutor - Panduan Lengkap

**URL:** http://localhost:3001/dashboard/tutor

---

## 📋 Fitur Lengkap Dashboard Tutor

Dashboard tutor adalah pusat kontrol untuk mengelola semua aspek layanan pengajaran Anda, termasuk:

1. **Kelola Layanan/Kelas** - Create, edit, delete layanan pengajaran
2. **Pengaturan Harga & Paket** - Atur harga per jam dan paket sesi
3. **Free Trial** - Tawarkan sesi gratis untuk siswa baru
4. **Diskon** - Berikan diskon pada layanan
5. **Kelola Testimonial** - Approve/reject testimonial dari siswa
6. **Saldo & Penarikan** - Lihat saldo dan tarik penghasilan

---

## 🎯 Tab 1: Overview

### **Statistik Dashboard**
Menampilkan 4 kartu statistik utama:

| Metrik | Deskripsi |
|--------|-----------|
| **Total Booking** | Jumlah total booking yang diterima |
| **Total Pendapatan** | Total penghasilan dari semua waktu |
| **Siswa Aktif** | Jumlah siswa aktif bulan ini |
| **Sesi Selesai** | Total sesi yang telah diselesaikan |

### **Quick View**
- **Layanan Aktif** - Daftar semua layanan yang sedang aktif
- **Testimonial Terbaru** - 3 testimonial terakhir yang disetujui

---

## 📚 Tab 2: Layanan/Kelas

### **Fitur Utama:**
- ✅ Tambah layanan baru
- ✅ Edit layanan existing
- ✅ Hapus layanan
- ✅ Aktifkan/nonaktifkan layanan

### **Form Tambah/Edit Layanan:**

#### **1. Informasi Dasar**
```
Mata Pelajaran: [Input Text]
- Contoh: Matematika, Fisika, Bahasa Inggris, Programming

Tingkat: [Dropdown]
- SD
- SMP
- SMA
- Universitas
```

#### **2. Harga & Paket**
```
Harga Per Jam: Rp [Input]
- Contoh: 150000
- Harga dasar per jam

Paket 5 Sesi (5% off): Rp [Auto-calculated]
- Otomatis: Harga × 5 × 0.95
- Bisa diubah manual

Paket 10 Sesi (10% off): Rp [Auto-calculated]
- Otomatis: Harga × 10 × 0.9
- Bisa diubah manual
```

**Contoh Perhitungan:**
- Harga per jam: Rp 150.000
- Paket 5 sesi: Rp 712.500 (hemat Rp 37.500)
- Paket 10 sesi: Rp 1.350.000 (hemat Rp 150.000)

#### **3. Free Trial**
```
☑ Tawarkan Free Trial

Durasi Free Trial: [Input] jam
- Minimal: 0.5 jam
- Maksimal: Bebas
- Contoh: 1 jam, 1.5 jam, 2 jam
```

**Manfaat Free Trial:**
- Menarik siswa baru
- Siswa bisa mencoba sebelum commit
- Badge "Free Trial" di profil tutor
- Meningkatkan conversion rate

#### **4. Diskon**
```
Diskon: [Input] %
- Range: 0-100%
- Diterapkan pada semua harga
- Contoh: 10% = Rp 150.000 jadi Rp 135.000
```

**Catatan:**
- Diskon diterapkan setelah perhitungan paket
- Tampil sebagai badge merah di card layanan

#### **5. Deskripsi**
```
Deskripsi: [Textarea]
- Jelaskan tentang kelas/layanan
- Metode mengajar
- Materi yang diajarkan
- Target siswa
```

**Contoh:**
```
Belajar matematika SMA dengan metode yang mudah dipahami. 
Fokus pada pemahaman konsep, bukan hafalan rumus. 
Cocok untuk persiapan ujian dan olimpiade.
```

#### **6. Status**
```
☑ Aktifkan layanan ini
- Checked: Layanan aktif, bisa dibooking
- Unchecked: Layanan nonaktif, tidak tampil
```

### **Card Layanan**
Setiap layanan ditampilkan dalam card dengan info:
- Nama subject & tingkat
- Harga per jam
- Paket 5 & 10 sesi
- Badge: Free Trial, Diskon, Status
- Deskripsi
- Tombol Edit & Hapus

---

## ⭐ Tab 3: Testimonial

### **Fitur:**
- ✅ Lihat semua testimonial
- ✅ Approve testimonial baru
- ✅ Reject testimonial
- ✅ Counter testimonial pending

### **Card Testimonial**
Setiap testimonial menampilkan:
```
┌─────────────────────────────────────┐
│ [Avatar] Ahmad Rizki                │
│          Matematika                 │
│                                     │
│ ⭐⭐⭐⭐⭐  2024-12-20              │
│                                     │
│ "Guru yang sangat sabar dan         │
│  menjelaskan dengan detail!"        │
│                                     │
│ [Setujui] [Tolak] atau [✓ Disetujui]│
└─────────────────────────────────────┘
```

### **Status Testimonial:**
- **Pending** - Menunggu persetujuan, tampil tombol Setujui/Tolak
- **Approved** - Sudah disetujui, tampil badge hijau
- **Rejected** - Dihapus dari sistem

### **Manfaat Testimonial:**
- Meningkatkan kredibilitas
- Menarik siswa baru
- Social proof
- Tampil di profil tutor

---

## 💰 Tab 4: Saldo & Penarikan

### **1. Saldo Tersedia**
```
┌─────────────────────────┐
│ Saldo Tersedia      💰  │
│ Rp 2.500.000           │
│                         │
│ [Tarik Saldo]          │
└─────────────────────────┘
```

**Saldo Tersedia:**
- Uang yang bisa ditarik
- Dari sesi yang sudah selesai
- Minimal penarikan: Rp 50.000

### **2. Saldo Pending**
```
┌─────────────────────────┐
│ Saldo Pending       ⏳  │
│ Rp 750.000             │
│                         │
│ Akan tersedia setelah   │
│ sesi selesai            │
└─────────────────────────┘
```

**Saldo Pending:**
- Dari booking yang confirmed
- Belum bisa ditarik
- Akan masuk ke saldo tersedia setelah sesi selesai

### **3. Form Penarikan Saldo**

Klik tombol "Tarik Saldo" untuk membuka modal:

```
┌─────────────────────────────────┐
│ Tarik Saldo                  ×  │
├─────────────────────────────────┤
│                                 │
│ Saldo Tersedia                  │
│ Rp 2.500.000                    │
│                                 │
│ Jumlah Penarikan:               │
│ [Input: 500000]                 │
│ Minimal penarikan Rp 50.000     │
│                                 │
│ Rekening Bank:                  │
│ [Dropdown]                      │
│ - Bank BCA - 1234567890         │
│ - Bank Mandiri - 0987654321     │
│ - Bank BNI - 1122334455         │
│                                 │
│ ⚠ Penarikan diproses 1-3 hari   │
│                                 │
│ [Tarik Saldo] [Batal]          │
└─────────────────────────────────┘
```

**Validasi:**
- Jumlah tidak boleh > saldo tersedia
- Minimal Rp 50.000
- Harus pilih rekening bank

### **4. Riwayat Transaksi**

Menampilkan semua transaksi:

```
┌──────────────────────────────────────────┐
│ Riwayat Transaksi                        │
├──────────────────────────────────────────┤
│ 💵 Pembayaran dari Ahmad Rizki           │
│    Matematika                            │
│    2024-12-28                            │
│                        +Rp 150.000 [Selesai]│
├──────────────────────────────────────────┤
│ 💵 Pembayaran dari Siti Nurhaliza        │
│    Fisika                                │
│    2024-12-27                            │
│                        +Rp 175.000 [Selesai]│
├──────────────────────────────────────────┤
│ 🏦 Penarikan ke Bank BCA                 │
│    2024-12-26                            │
│                        -Rp 500.000 [Selesai]│
├──────────────────────────────────────────┤
│ 💵 Pembayaran dari Dewi Lestari          │
│    Matematika (Paket 5)                  │
│    2024-12-25                            │
│                        +Rp 300.000 [Pending]│
└──────────────────────────────────────────┘
```

**Jenis Transaksi:**
- **Earning (💵)** - Pendapatan dari booking (hijau, +)
- **Withdrawal (🏦)** - Penarikan saldo (merah, -)

**Status:**
- **Selesai** - Transaksi berhasil (badge hijau)
- **Pending** - Menunggu proses (badge kuning)

---

## 🎨 Contoh Use Case

### **Scenario 1: Menambah Layanan Baru**

1. Klik tab "📚 Layanan/Kelas"
2. Klik tombol "+ Tambah Layanan Baru"
3. Isi form:
   ```
   Mata Pelajaran: Programming
   Tingkat: Universitas
   Harga Per Jam: 200000
   Paket 5 Sesi: 950000 (auto)
   Paket 10 Sesi: 1800000 (auto)
   ☑ Tawarkan Free Trial
   Durasi Free Trial: 1 jam
   Diskon: 15%
   Deskripsi: Belajar web development dengan React & Node.js
   ☑ Aktifkan layanan ini
   ```
4. Klik "Tambah Layanan"
5. Layanan muncul di daftar dengan badge:
   - 🟢 Free Trial 1 jam
   - 🔴 Diskon 15%
   - 🔵 Aktif

### **Scenario 2: Approve Testimonial**

1. Klik tab "⭐ Testimonial"
2. Lihat testimonial pending (tanpa badge)
3. Baca komentar siswa
4. Klik "Setujui" jika sesuai
5. Testimonial berubah status jadi "✓ Disetujui"
6. Testimonial tampil di profil tutor

### **Scenario 3: Tarik Saldo**

1. Klik tab "💰 Saldo & Penarikan"
2. Cek saldo tersedia: Rp 2.500.000
3. Klik "Tarik Saldo"
4. Isi form:
   ```
   Jumlah: 1000000
   Rekening: Bank BCA - 1234567890
   ```
5. Klik "Tarik Saldo"
6. Saldo berkurang: Rp 1.500.000
7. Transaksi muncul di riwayat dengan status "Pending"
8. Setelah 1-3 hari, status jadi "Selesai"

---

## 📊 Mock Data yang Tersedia

### **Services (2 layanan):**
1. **Matematika SMA**
   - Harga: Rp 150.000/jam
   - Paket 5: Rp 700.000
   - Paket 10: Rp 1.300.000
   - Free Trial: 1 jam
   - Diskon: 10%

2. **Fisika SMA**
   - Harga: Rp 175.000/jam
   - Paket 5: Rp 825.000
   - Paket 10: Rp 1.550.000
   - No Free Trial
   - No Diskon

### **Testimonials (3 testimonial):**
1. Ahmad Rizki - ⭐⭐⭐⭐⭐ (Approved)
2. Siti Nurhaliza - ⭐⭐⭐⭐ (Approved)
3. Budi Santoso - ⭐⭐⭐⭐⭐ (Pending)

### **Wallet:**
- Saldo Tersedia: Rp 2.500.000
- Saldo Pending: Rp 750.000
- 4 Transaksi (2 earning, 1 withdrawal, 1 pending)

### **Stats:**
- Total Booking: 45
- Total Pendapatan: Rp 6.750.000
- Siswa Aktif: 12
- Sesi Selesai: 38

---

## 🚀 Cara Mengakses

### **1. Login sebagai Tutor**
```
URL: http://localhost:3001/login
Email: tutor@example.com (atau email tutor lain)
Password: password123
```

### **2. Otomatis Redirect**
Setelah login, jika role = tutor, otomatis redirect ke:
```
http://localhost:3001/dashboard/tutor
```

### **3. Manual Access**
Bisa juga langsung akses:
```
http://localhost:3001/dashboard/tutor
```

---

## 🎯 Fitur yang Bisa Ditest

### **✅ Kelola Layanan:**
- [x] Tambah layanan baru
- [x] Edit layanan existing
- [x] Hapus layanan
- [x] Toggle aktif/nonaktif
- [x] Set harga & paket
- [x] Enable/disable free trial
- [x] Set durasi free trial
- [x] Set diskon
- [x] Edit deskripsi

### **✅ Kelola Testimonial:**
- [x] Lihat semua testimonial
- [x] Approve testimonial pending
- [x] Reject testimonial
- [x] Counter pending testimonial
- [x] Filter approved testimonial

### **✅ Saldo & Penarikan:**
- [x] Lihat saldo tersedia
- [x] Lihat saldo pending
- [x] Tarik saldo
- [x] Pilih rekening bank
- [x] Validasi minimal penarikan
- [x] Lihat riwayat transaksi
- [x] Filter by type (earning/withdrawal)
- [x] Status transaksi

### **✅ Overview:**
- [x] Lihat statistik
- [x] Quick view layanan aktif
- [x] Quick view testimonial

---

## 💡 Tips & Best Practices

### **Untuk Layanan:**
1. **Harga Kompetitif** - Riset harga pasar untuk subject Anda
2. **Free Trial** - Tawarkan untuk menarik siswa baru
3. **Paket Sesi** - Berikan diskon untuk paket agar siswa commit lebih lama
4. **Deskripsi Jelas** - Jelaskan metode, materi, dan target siswa
5. **Update Berkala** - Sesuaikan harga dan promo sesuai demand

### **Untuk Testimonial:**
1. **Approve Cepat** - Jangan biarkan testimonial pending terlalu lama
2. **Pilih yang Terbaik** - Approve testimonial yang detail dan positif
3. **Reject Spam** - Tolak testimonial yang tidak relevan
4. **Respond** - (future) Balas testimonial untuk engagement

### **Untuk Saldo:**
1. **Tarik Berkala** - Jangan tunggu saldo terlalu besar
2. **Cek Pending** - Monitor saldo pending untuk proyeksi income
3. **Rekening Verified** - Pastikan rekening bank sudah terverifikasi
4. **Track Transaksi** - Cek riwayat untuk rekonsiliasi

---

## 🔐 Security & Validation

### **Access Control:**
- ✅ Hanya tutor yang bisa akses dashboard tutor
- ✅ Student otomatis redirect ke dashboard student
- ✅ Perlu login untuk akses

### **Form Validation:**
- ✅ Required fields: Subject, Level, Price
- ✅ Minimal penarikan: Rp 50.000
- ✅ Penarikan tidak boleh > saldo
- ✅ Diskon range: 0-100%
- ✅ Free trial minimal: 0.5 jam

### **Data Validation:**
- ✅ Harga harus angka positif
- ✅ Paket auto-calculate dengan diskon
- ✅ Status boolean (active/inactive)

---

## 🎨 UI/UX Features

### **Responsive Design:**
- ✅ Mobile-friendly
- ✅ Grid layout adaptive
- ✅ Modal scrollable
- ✅ Touch-friendly buttons

### **Visual Feedback:**
- ✅ Loading states
- ✅ Success messages
- ✅ Error handling
- ✅ Hover effects
- ✅ Color-coded badges

### **User Experience:**
- ✅ Tab navigation
- ✅ Modal forms
- ✅ Auto-calculation
- ✅ Inline editing
- ✅ Confirmation dialogs

---

## 📱 Responsive Breakpoints

```css
Mobile (< 768px):
- Stack cards vertically
- Full-width forms
- Simplified navigation

Tablet (768px - 1024px):
- 2-column grid
- Side-by-side forms
- Compact stats

Desktop (> 1024px):
- 4-column stats
- 2-column services
- Full-width tables
```

---

## 🚀 Next Steps (Future Enhancements)

### **Phase 2:**
- [ ] Real-time notifications
- [ ] Analytics dashboard
- [ ] Revenue charts
- [ ] Student management
- [ ] Schedule calendar
- [ ] Automated invoicing

### **Phase 3:**
- [ ] Multi-currency support
- [ ] Tax calculation
- [ ] Export reports (PDF/Excel)
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Integration with payment gateway

---

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek dokumentasi ini
2. Test dengan mock data
3. Cek console untuk error
4. Verify user role = tutor

---

**Dashboard Tutor sudah lengkap dan siap digunakan!** 🎉

Semua fitur yang diminta sudah terimplementasi:
- ✅ Create/Edit/Delete Layanan
- ✅ Pengaturan Harga & Paket
- ✅ Free Trial Settings
- ✅ Diskon
- ✅ Manage Testimonial
- ✅ Saldo & Penarikan
