# Test Credentials & Dummy Data

**Date:** December 29, 2024  
**Environment:** Development/Testing

---

## 🔐 TEST ACCOUNTS

### **1. Admin Account**
```
Email: admin@blajarplus.com
Password: Admin123!
Role: admin
```

### **2. Tutor Accounts**

#### **Tutor 1 - Matematika & Fisika**
```
Email: tutor1@test.com
Password: Tutor123!
Name: Dr. Ahmad Hidayat
Role: tutor
Subjects: Matematika, Fisika
Level: SMA, University
Hourly Rate: Rp 150,000
City: Jakarta
Status: Verified
```

#### **Tutor 2 - Bahasa Inggris**
```
Email: tutor2@test.com
Password: Tutor123!
Name: Sarah Johnson
Role: tutor
Subjects: Bahasa Inggris
Level: SD, SMP, SMA
Hourly Rate: Rp 120,000
City: Bandung
Status: Verified
```

#### **Tutor 3 - Programming**
```
Email: tutor3@test.com
Password: Tutor123!
Name: Budi Santoso
Role: tutor
Subjects: Programming, Web Development
Level: University, Professional
Hourly Rate: Rp 200,000
City: Surabaya
Status: Verified
```

### **3. Student Accounts**

#### **Student 1**
```
Email: student1@test.com
Password: Student123!
Name: Andi Wijaya
Role: student
```

#### **Student 2**
```
Email: student2@test.com
Password: Student123!
Name: Siti Nurhaliza
Role: student
```

#### **Student 3**
```
Email: student3@test.com
Password: Student123!
Name: Rudi Hartono
Role: student
```

---

## 📊 DUMMY DATA INCLUDED

### **Subjects (10)**
- Matematika
- Fisika
- Kimia
- Biologi
- Bahasa Inggris
- Bahasa Indonesia
- Programming
- Web Development
- Design
- Music

### **Bookings (15)**
- Various statuses: pending, confirmed, completed, cancelled
- Different dates (past, present, future)
- Different subjects and tutors
- Price range: Rp 100,000 - Rp 400,000

### **Reviews (8)**
- Ratings: 4-5 stars
- Real feedback comments
- Distributed across tutors

### **Progress Logs (6)**
- Summary of lessons
- Homework assignments
- Next lesson plans

### **Tutor Availability (21)**
- Weekly schedules for all tutors
- Different time slots
- Various slot durations (60-120 min)

### **Messages (12)**
- Conversations between students and tutors
- Sample questions and responses

### **Payments (10)**
- Completed payments
- Various amounts
- Linked to bookings

---

## 🚀 QUICK START

### **1. Run Seeder**
```bash
cd backend
npm run seed
# or
npx prisma db seed
```

### **2. Login as Tutor**
1. Go to http://localhost:3000/login
2. Email: `tutor1@test.com`
3. Password: `Tutor123!`
4. Explore tutor features:
   - Dashboard
   - Students list
   - Schedule management
   - Earnings
   - Syllabus

### **3. Login as Student**
1. Go to http://localhost:3000/login
2. Email: `student1@test.com`
3. Password: `Student123!`
4. Explore student features:
   - Search tutors
   - Book sessions
   - View calendar
   - Chat with tutors
   - Leave reviews

### **4. Login as Admin**
1. Go to http://localhost:3000/login
2. Email: `admin@blajarplus.com`
3. Password: `Admin123!`
4. Explore admin features:
   - Verify tutors
   - Approve withdrawals
   - View statistics

---

## 📝 TEST SCENARIOS

### **Scenario 1: Student Books a Tutor**
1. Login as `student1@test.com`
2. Go to /search
3. Filter: Matematika, Jakarta
4. Select tutor (Dr. Ahmad Hidayat)
5. Click "Lihat Profile"
6. Click "Book Now"
7. Select date, time, subject
8. Complete booking
9. Make payment (test mode)

### **Scenario 2: Tutor Manages Schedule**
1. Login as `tutor1@test.com`
2. Go to /tutor/schedule
3. Add availability:
   - Day: Monday
   - Time: 09:00-17:00
   - Slot: 60 min
4. Add time off:
   - Dates: Next week
   - Reason: Vacation
5. View available slots

### **Scenario 3: Tutor Tracks Student Progress**
1. Login as `tutor1@test.com`
2. Go to /tutor/students
3. Select student (Andi Wijaya)
4. View progress:
   - Total classes
   - Progress logs
   - Material completion
5. Add new progress log

### **Scenario 4: Student Views Calendar**
1. Login as `student1@test.com`
2. Go to /student/calendar
3. View week view
4. See upcoming classes
5. Click booking for details

### **Scenario 5: Chat Between Student & Tutor**
1. Login as `student1@test.com`
2. Go to /chat
3. Select conversation with tutor
4. Send message
5. Logout, login as tutor
6. Reply to message

---

## 🎯 TESTING CHECKLIST

### **Authentication**
- [ ] Register new account
- [ ] Login with test credentials
- [ ] Logout
- [ ] Password validation

### **Student Features**
- [ ] Search tutors
- [ ] Filter by subject/city/price
- [ ] View tutor profile
- [ ] Book session
- [ ] Make payment
- [ ] View bookings
- [ ] View calendar
- [ ] Chat with tutor
- [ ] Leave review

### **Tutor Features**
- [ ] Create profile
- [ ] Set availability
- [ ] Set time off
- [ ] View students list
- [ ] View student progress
- [ ] Create syllabus
- [ ] Add materials
- [ ] Update progress log
- [ ] View earnings
- [ ] Request withdrawal
- [ ] Confirm booking
- [ ] Complete booking

### **Admin Features**
- [ ] View pending tutors
- [ ] Verify tutor
- [ ] Reject tutor
- [ ] View pending withdrawals
- [ ] Approve withdrawal
- [ ] Reject withdrawal
- [ ] View statistics

---

## 📊 DATA STATISTICS

```
Users: 7 (1 admin, 3 tutors, 3 students)
Tutor Profiles: 3
Subjects: 10
Tutor Subjects: 8
Bookings: 15
  - Pending: 3
  - Confirmed: 5
  - Completed: 5
  - Cancelled: 2
Reviews: 8
Progress Logs: 6
Payments: 10
Messages: 12
Conversations: 3
Availability Slots: 21
```

---

## 🔄 RESET DATA

To reset and reseed database:

```bash
cd backend

# Reset database
npx prisma migrate reset

# Or manually:
npx prisma db push --force-reset
npx prisma db seed
```

---

## 💡 TIPS

1. **Use different browsers** for testing multiple roles simultaneously
2. **Check console logs** for API responses
3. **Verify email notifications** (if configured)
4. **Test responsive design** on mobile
5. **Try edge cases** (invalid data, empty states)

---

## 🐛 KNOWN TEST DATA LIMITATIONS

1. **Payments:** Using test/dummy payment gateway
2. **Emails:** Not sent in development (logged to console)
3. **File uploads:** Use placeholder URLs
4. **Real-time:** WebSocket not fully implemented
5. **Notifications:** Basic implementation

---

## 📞 SUPPORT

If you encounter issues with test data:
1. Check database connection
2. Verify Prisma schema is up to date
3. Run migrations: `npx prisma migrate dev`
4. Regenerate client: `npx prisma generate`
5. Reseed: `npm run seed`

---

**Created:** December 29, 2024  
**Last Updated:** December 29, 2024  
**Status:** ✅ READY FOR TESTING
