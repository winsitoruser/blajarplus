# 📊 Admin Dashboard - Comprehensive Guide

**BlajarPlus Admin Monitoring System**  
**Created:** December 29, 2024  
**Version:** 1.0

---

## 🎯 Overview

Admin Dashboard adalah sistem monitoring komprehensif untuk administrator BlajarPlus yang memungkinkan monitoring dan manajemen:
- **Transaksi** - Semua pembayaran dan transaksi keuangan
- **Aktivitas Bisnis** - Metrik dan analitik platform
- **Tutor** - Manajemen dan monitoring tutor
- **Student** - Monitoring aktivitas student
- **Courses/Subjects** - Performa mata pelajaran

---

## 🚀 Fitur Utama

### **1. Dashboard Overview** (`/admin/dashboard`)

**Key Metrics:**
- Total Users (Students + Tutors)
- Total Bookings (Active + Completed)
- Total Revenue (Platform + Tutors)
- Pending Verifications

**Features:**
- Real-time statistics
- Recent activities feed
- Quick navigation cards
- Time range filters (7/30/90 days)

**API Endpoints:**
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/recent-activities` - Recent platform activities
- `GET /api/admin/activities?days=30` - Business activities over time

---

### **2. Transaction Monitoring** (`/admin/transactions`)

**Features:**
- View all payment transactions
- Filter by status (Success/Pending/Failed)
- Filter by date range
- Pagination support
- Transaction details:
  - Transaction ID
  - Student & Tutor info
  - Amount
  - Payment provider
  - Status
  - Date

**API Endpoint:**
```
GET /api/admin/transactions?page=1&limit=20&status=success&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "amount": 150000,
      "status": "success",
      "provider": "midtrans",
      "booking": {
        "student": { "fullName": "...", "email": "..." },
        "tutor": { "user": { "fullName": "...", "email": "..." } }
      },
      "createdAt": "2024-12-29T..."
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### **3. Tutor Management** (`/admin/tutors`)

**Features:**
- View all tutors with detailed stats
- Filter by verification status (Approved/Pending/Rejected)
- Search by name or email
- Tutor cards showing:
  - Profile information
  - Verification status
  - Hourly rate
  - Experience years
  - Rating & reviews
  - Booking statistics
  - Total earnings
  - Subjects taught
- View detailed tutor profile

**API Endpoint:**
```
GET /api/admin/tutors?page=1&limit=20&status=approved&search=john
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": {
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "081234567890"
      },
      "verificationStatus": "approved",
      "hourlyRate": 150000,
      "experienceYears": 5,
      "ratingAvg": 4.8,
      "ratingCount": 25,
      "subjects": [...],
      "stats": {
        "totalBookings": 50,
        "completedBookings": 45,
        "totalEarnings": 6750000
      }
    }
  ],
  "meta": { ... }
}
```

---

### **4. Student Monitoring** (`/admin/students`)

**Features:**
- View all students
- Search by name or email
- Student information:
  - Profile details
  - Contact information
  - Total bookings
  - Completed bookings
  - Total spent
  - Join date
  - Last login
- Pagination support

**API Endpoint:**
```
GET /api/admin/students?page=1&limit=20&search=jane
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "fullName": "Jane Smith",
      "email": "jane@example.com",
      "phone": "081234567891",
      "createdAt": "2024-01-15T...",
      "lastLoginAt": "2024-12-29T...",
      "stats": {
        "totalBookings": 10,
        "completedBookings": 8,
        "totalSpent": 1200000
      }
    }
  ],
  "meta": { ... }
}
```

---

### **5. Subjects/Courses Monitoring** (`/admin/subjects`)

**Features:**
- View all subjects grouped by category
- Subject statistics:
  - Total tutors (active/inactive)
  - Total bookings
  - Completed bookings
  - Completion rate
  - Popularity indicator
- Visual progress bars
- Category grouping

**API Endpoint:**
```
GET /api/admin/subjects
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Mathematics",
    "description": "...",
    "category": {
      "name": "Academic"
    },
    "stats": {
      "totalTutors": 15,
      "activeTutors": 12,
      "totalBookings": 150,
      "completedBookings": 135
    }
  }
]
```

---

### **6. Business Activities** (Dashboard)

**Features:**
- Daily statistics over time
- Metrics tracked:
  - New bookings per day
  - Revenue per day
  - New users per day
  - New tutors per day
- Configurable time range (7/30/90 days)

**API Endpoint:**
```
GET /api/admin/activities?days=30
```

**Response:**
```json
[
  {
    "date": "2024-12-29",
    "bookings": 5,
    "revenue": 750000,
    "newUsers": 3,
    "newTutors": 1
  }
]
```

---

## 🔐 Authentication & Authorization

**Access Control:**
- Only users with `role: 'admin'` can access admin endpoints
- JWT token required in Authorization header
- All endpoints protected with `@UseGuards(AuthGuard('jwt'))`

**Login as Admin:**
```
Email: admin@blajarplus.com
Password: Test123!
```

**API Request Example:**
```javascript
const token = localStorage.getItem('token')
const response = await axios.get('http://localhost:3001/api/admin/stats', {
  headers: { Authorization: `Bearer ${token}` }
})
```

---

## 📁 File Structure

### **Backend:**
```
backend/src/admin/
├── admin.controller.ts    # API endpoints
├── admin.service.ts       # Business logic
├── admin.module.ts        # Module configuration
└── dto/
    └── index.ts           # Data transfer objects
```

### **Frontend:**
```
frontend/src/app/admin/
├── dashboard/
│   └── page.tsx          # Main dashboard
├── transactions/
│   └── page.tsx          # Transaction monitoring
├── tutors/
│   └── page.tsx          # Tutor management
├── students/
│   └── page.tsx          # Student monitoring
└── subjects/
    └── page.tsx          # Subject/course monitoring
```

---

## 🛠️ Backend API Endpoints

### **Statistics & Overview**
```
GET  /api/admin/stats                    # Dashboard statistics
GET  /api/admin/recent-activities        # Recent activities
GET  /api/admin/activities?days=30       # Business activities
```

### **Transaction Management**
```
GET  /api/admin/transactions             # All transactions
     ?page=1&limit=20
     &status=success
     &startDate=2024-01-01
     &endDate=2024-12-31
```

### **Tutor Management**
```
GET  /api/admin/tutors                   # All tutors
     ?page=1&limit=20
     &status=approved
     &search=john

GET  /api/admin/tutors/pending           # Pending verifications
GET  /api/admin/tutors/:id               # Tutor details
PUT  /api/admin/tutors/:id/verify        # Verify/reject tutor
```

### **Student Management**
```
GET  /api/admin/students                 # All students
     ?page=1&limit=20
     &search=jane
```

### **Subject Management**
```
GET  /api/admin/subjects                 # All subjects with stats
```

### **Withdrawal Management**
```
GET  /api/admin/withdrawals/pending      # Pending withdrawals
PUT  /api/admin/withdrawals/:id/approve  # Approve withdrawal
PUT  /api/admin/withdrawals/:id/reject   # Reject withdrawal
```

---

## 💻 Usage Examples

### **1. Fetch Dashboard Stats**
```typescript
const fetchStats = async () => {
  const token = localStorage.getItem('token')
  const response = await axios.get(
    'http://localhost:3001/api/admin/stats',
    { headers: { Authorization: `Bearer ${token}` } }
  )
  console.log(response.data)
  // {
  //   users: { total: 100, students: 85, tutors: 15 },
  //   tutors: { total: 15, verified: 12, pending: 3 },
  //   bookings: { total: 200, completed: 180, active: 20 },
  //   revenue: { total: 30000000, platform: 4500000, tutors: 25500000 }
  // }
}
```

### **2. Filter Transactions**
```typescript
const fetchTransactions = async () => {
  const params = new URLSearchParams({
    page: '1',
    limit: '20',
    status: 'success',
    startDate: '2024-12-01',
    endDate: '2024-12-31'
  })
  
  const response = await axios.get(
    `http://localhost:3001/api/admin/transactions?${params}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
```

### **3. Search Tutors**
```typescript
const searchTutors = async (searchTerm: string) => {
  const response = await axios.get(
    `http://localhost:3001/api/admin/tutors?search=${searchTerm}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
}
```

---

## 🎨 UI Components

### **Dashboard Cards**
- Quick stats with icons
- Color-coded by category
- Hover effects
- Click to navigate

### **Data Tables**
- Sortable columns
- Pagination
- Search/filter
- Responsive design

### **Stat Cards**
- Visual metrics
- Progress bars
- Trend indicators
- Color-coded status

### **Activity Feed**
- Real-time updates
- Type indicators (booking/payment/user)
- Timestamp
- Status badges

---

## 📊 Key Metrics Explained

### **Platform Revenue**
- **Total Revenue:** Sum of all completed bookings
- **Platform Commission:** 15% of total revenue
- **Tutor Earnings:** 85% of total revenue

### **Booking Statistics**
- **Total Bookings:** All bookings created
- **Completed:** Successfully finished sessions
- **Active:** Confirmed or in-progress bookings

### **User Statistics**
- **Total Users:** All registered users
- **Students:** Users with role 'student'
- **Tutors:** Users with tutor profiles

### **Tutor Verification**
- **Verified:** Approved tutors (can accept bookings)
- **Pending:** Awaiting admin verification
- **Rejected:** Not approved

---

## 🔍 Monitoring Best Practices

### **Daily Tasks:**
1. Check pending tutor verifications
2. Review recent transactions
3. Monitor active bookings
4. Check pending withdrawals

### **Weekly Tasks:**
1. Analyze revenue trends
2. Review tutor performance
3. Check subject popularity
4. Monitor user growth

### **Monthly Tasks:**
1. Generate comprehensive reports
2. Analyze platform metrics
3. Review business activities
4. Plan improvements

---

## 🚦 Status Indicators

### **Transaction Status:**
- 🟢 **Success:** Payment completed
- 🟡 **Pending:** Awaiting confirmation
- 🔴 **Failed:** Payment failed

### **Tutor Status:**
- 🟢 **Approved:** Verified and active
- 🟡 **Pending:** Awaiting verification
- 🔴 **Rejected:** Not approved

### **Booking Status:**
- 🟢 **Completed:** Session finished
- 🟡 **Confirmed:** Scheduled
- 🔵 **Draft:** Not yet confirmed
- 🔴 **Cancelled:** Cancelled by user

---

## 🔧 Troubleshooting

### **Issue: Cannot access admin dashboard**
**Solution:** Ensure you're logged in as admin user

### **Issue: Data not loading**
**Solution:** Check backend is running on port 3001

### **Issue: Unauthorized error**
**Solution:** Token may be expired, login again

### **Issue: Stats showing zero**
**Solution:** Database may not have data, run seed script

---

## 📝 Development Notes

### **Adding New Metrics:**
1. Add backend service method in `admin.service.ts`
2. Add controller endpoint in `admin.controller.ts`
3. Create/update frontend component
4. Add API call in frontend

### **Adding New Filters:**
1. Update backend service to accept filter params
2. Add filter UI in frontend
3. Update API call with new params

### **Performance Optimization:**
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Add database indexes for common queries
- Use lazy loading for charts/graphs

---

## 🎯 Future Enhancements

**Planned Features:**
- [ ] Export data to CSV/Excel
- [ ] Advanced analytics charts
- [ ] Real-time notifications
- [ ] Email reports
- [ ] Custom date range picker
- [ ] Bulk actions
- [ ] Advanced filtering
- [ ] Dashboard customization
- [ ] Role-based access control
- [ ] Audit logs

---

## 📞 Support

**For Issues:**
- Check logs in browser console
- Check backend logs
- Verify API endpoints are accessible
- Ensure database is seeded with test data

**Test Admin Credentials:**
```
Email: admin@blajarplus.com
Password: Test123!
```

---

## ✅ Summary

Admin Dashboard menyediakan:
- ✅ Comprehensive monitoring untuk semua aspek platform
- ✅ Real-time statistics dan metrics
- ✅ Transaction tracking dan management
- ✅ Tutor dan student monitoring
- ✅ Subject/course performance tracking
- ✅ Business activity analytics
- ✅ User-friendly interface
- ✅ Responsive design
- ✅ Secure authentication

**Total Pages:** 5 (Dashboard, Transactions, Tutors, Students, Subjects)  
**Total API Endpoints:** 10+  
**Status:** ✅ Production Ready

---

**Created with ❤️ for BlajarPlus Admin Team**
