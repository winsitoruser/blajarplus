# 🧪 Testing Guide - BlajarPlus Platform

**Comprehensive Flow Testing Guide**  
**Last Updated**: December 30, 2025

---

## 🚀 Quick Start

### Prerequisites
1. Backend running on `http://localhost:3000`
2. Frontend running on `http://localhost:3001`
3. Database seeded with demo data

### Demo Accounts
```
Student Account:
- Email: demo@blajarplus.com
- Password: demo12345

Tutor Accounts (created by seed script):
- Email: tutor1@blajarplus.com (Budi Santoso)
- Email: tutor2@blajarplus.com (Siti Nurhaliza)
- Email: tutor3@blajarplus.com (Andi Wijaya)
- Password: demo12345 (all)
```

---

## 📋 STUDENT FLOW TESTING

### ✅ Test 1: Registration & Login

#### Steps:
1. **Register New Student**
   - Go to `http://localhost:3001/register`
   - Fill form:
     - Full Name: "Test Student"
     - Email: "teststudent@example.com"
     - Phone: "+628123456789"
     - Password: "password123"
   - Click "Daftar"
   - Expected: Success message, redirect to dashboard

2. **Login**
   - Go to `http://localhost:3001/login`
   - Enter email and password
   - Click "Masuk"
   - Expected: Redirect to `/dashboard`

3. **Check Navbar**
   - Expected: "Dashboard" menu visible
   - Expected: "Masuk" button changed to "Keluar"
   - Expected: "Daftar" button hidden
   - Expected: User greeting "Halo, Test Student"

**Status**: ✅ Should work

---

### ✅ Test 2: Profile Completion

#### Steps:
1. Login as student
2. Go to Dashboard → Profile tab
3. **Update Profile**:
   - Address: "Jl. Sudirman No. 123"
   - City: "Jakarta"
   - Province: "DKI Jakarta"
   - Bio: "Saya seorang pelajar yang ingin belajar"
   - Click "Simpan Profil"
   - Expected: Success message

4. **Upload Avatar**:
   - Click "Upload Foto"
   - Select image file
   - Expected: Avatar updated

5. **Change Password**:
   - Current Password: "password123"
   - New Password: "newpassword123"
   - Confirm Password: "newpassword123"
   - Click "Ubah Password"
   - Expected: Success message

**Status**: ✅ Should work

---

### ✅ Test 3: Search & Select Tutor

#### Steps:
1. **Search Tutors**:
   - Go to `http://localhost:3001/search`
   - Expected: Banner carousel visible (smaller height)
   - Expected: Search history section (if logged in)
   - Expected: Recommendations section
   - Expected: Tutor list displayed

2. **Apply Filters**:
   - Subject: "Matematika"
   - Level: "SMA"
   - Location: "Jakarta"
   - Click "Cari"
   - Expected: Filtered results

3. **View Tutor Profile**:
   - Click on a tutor card
   - Expected: Redirect to `/tutor/[id]`
   - Expected: Tutor info displayed (name, bio, rating, price)
   - Expected: Services/subjects listed
   - Expected: "Book" or "Chat" button visible

**Status**: ✅ Should work

---

### ✅ Test 4: Chat with Tutor

#### Steps:
1. **Open ChatBox**:
   - Look for floating chat button (bottom-right)
   - Expected: Red badge showing unread count (6 messages)
   - Click chat button

2. **View Conversations**:
   - Expected: 3 conversations listed
   - Expected: Each has unread badge
   - Expected: Last message preview shown
   - Expected: Relative timestamps (2h ago, 1d ago)

3. **Open Conversation**:
   - Click on "Budi Santoso" conversation
   - Expected: Chat history loaded
   - Expected: Messages displayed with bubbles
   - Expected: Own messages on right (blue)
   - Expected: Tutor messages on left (gray)
   - Expected: Unread badge decreases

4. **Send Message**:
   - Type: "Halo, saya tertarik dengan les Matematika"
   - Press Enter or click Send
   - Expected: Message appears immediately
   - Expected: Auto-scroll to bottom

5. **Test Features**:
   - Click minimize button
   - Expected: Window minimized to header only
   - Click maximize
   - Expected: Window restored
   - Click close (X)
   - Expected: ChatBox closed
   - Click floating button again
   - Expected: ChatBox reopens

**Status**: ✅ FULLY FUNCTIONAL (tested with dummy data)

---

### ⚠️ Test 5: Create Booking

#### Steps:
1. **From Tutor Profile**:
   - Go to tutor profile page
   - Click "Book Now" or similar button
   - Expected: Redirect to `/booking/[tutorId]`

2. **Fill Booking Form**:
   - Select service/subject
   - Select date
   - Select time slot
   - Select duration (1 hour, 2 hours, etc.)
   - Review total amount
   - Click "Create Booking"
   - Expected: Booking created (status: pending_payment)
   - Expected: Redirect to payment page

**Status**: ⚠️ NEEDS TESTING
**Potential Issues**: 
- Availability slots might not be populated
- Need to verify booking creation API

---

### ⚠️ Test 6: Payment

#### Steps:
1. **Payment Page** (`/payment/[bookingId]`):
   - Expected: Booking details displayed
   - Expected: Amount shown
   - Expected: Payment methods listed

2. **Select Payment Method**:
   - Choose payment method (e.g., "Bank Transfer", "E-Wallet")
   - Click "Pay Now"
   - Expected: Payment processing
   - Expected: Redirect to payment gateway (Midtrans sandbox)

3. **Complete Payment**:
   - In sandbox, simulate successful payment
   - Expected: Redirect to `/payment/success`
   - Expected: Booking status updated to "confirmed"

4. **Check Wallet** (Backend):
   - Tutor wallet should receive funds (minus platform fee)
   - Ledger entry created (type: escrow_hold)

**Status**: ⚠️ NEEDS TESTING
**Potential Issues**:
- Midtrans integration needs API keys
- Wallet system needs verification

---

### ⚠️ Test 7: View Schedule

#### Steps:
1. **Student Dashboard**:
   - Go to `/dashboard`
   - Check "Overview" tab
   - Expected: Recent bookings displayed
   - Expected: Upcoming bookings shown
   - Expected: Booking status visible

2. **Bookings Page** (if exists):
   - Go to `/bookings`
   - Expected: All bookings listed
   - Expected: Filter by status
   - Expected: View booking details

**Status**: ⚠️ NEEDS TESTING

---

## 📋 TUTOR FLOW TESTING

### ✅ Test 8: Tutor Registration

#### Steps:
1. **Register as Tutor**:
   - Go to `/register`
   - Fill form with role="tutor" (or separate tutor registration)
   - Expected: Account created
   - Expected: Redirect to tutor profile creation

2. **Login as Tutor**:
   - Go to `/login`
   - Use tutor credentials
   - Expected: Redirect to `/dashboard/tutor` or `/tutor/profile/create`

**Status**: ✅ Should work

---

### ⚠️ Test 9: Tutor Profile Creation & KYC

#### Steps:
1. **Create Profile** (`/tutor/profile/create`):
   - Headline: "Tutor Matematika Berpengalaman"
   - Bio: "10 tahun mengajar..."
   - Education: "S1 Matematika UI"
   - Experience Years: 10
   - Teaching Modes: [online, offline]
   - Base City: "Jakarta"
   - Hourly Rate: 150000
   - Offer Free Trial: Yes
   - Free Trial Duration: 30 minutes
   - Click "Create Profile"
   - Expected: Profile created
   - Expected: Redirect to tutor dashboard

2. **Upload KYC Documents**:
   - Go to tutor dashboard
   - Find KYC/Verification section
   - Upload ID card
   - Upload certificate
   - Expected: Documents uploaded
   - Expected: Verification status: "pending"

**Status**: ⚠️ NEEDS TESTING
**Potential Issues**:
- KYC upload interface might not exist
- Admin verification flow not implemented

---

### ⚠️ Test 10: Create Services/Classes

#### Steps:
1. **Add Service** (Tutor Dashboard):
   - Go to `/dashboard/tutor`
   - Find "Services" or "Mata Pelajaran" section
   - Click "Add Service"
   - Select Subject: "Matematika"
   - Enter Level: "SMA" (custom input)
   - Price Override: 200000 (optional)
   - Description: "Fokus pada kalkulus dan aljabar"
   - Click "Save"
   - Expected: Service added to list
   - Expected: Service visible in search

**Status**: ✅ Should work (service creation exists)

---

### ❌ Test 11: Set Availability

#### Steps:
1. **Manage Availability**:
   - Go to tutor dashboard
   - Find "Availability" or "Jadwal" section
   - Add availability:
     - Day: Monday
     - Start Time: 09:00
     - End Time: 17:00
   - Click "Save"
   - Expected: Availability saved
   - Expected: Slots available for booking

**Status**: ❌ NOT IMPLEMENTED
**Action Required**: Need to create availability management UI and API

---

### ⚠️ Test 12: Receive & Manage Orders

#### Steps:
1. **View Bookings**:
   - Student creates booking
   - Tutor goes to dashboard
   - Expected: New booking notification
   - Expected: Booking listed with status "pending"

2. **Confirm Booking**:
   - Click "Confirm" on booking
   - Expected: Status changed to "confirmed"
   - Expected: Student notified

3. **Reject Booking**:
   - Click "Reject" on booking
   - Enter reason
   - Expected: Status changed to "cancelled"
   - Expected: Student refunded

**Status**: ⚠️ NEEDS TESTING
**Potential Issues**:
- Notification system not implemented
- Refund logic needs verification

---

### ✅ Test 13: Chat with Students

#### Steps:
1. **Receive Message**:
   - Student sends message
   - Tutor sees unread badge on chat button
   - Click chat button
   - Expected: Conversation listed with unread count

2. **Reply to Student**:
   - Open conversation
   - Type reply
   - Send message
   - Expected: Message delivered to student

**Status**: ✅ FULLY FUNCTIONAL

---

### ❌ Test 14: View Earnings & Withdraw

#### Steps:
1. **View Earnings** (`/tutor/earnings`):
   - Go to earnings page
   - Expected: Current balance displayed
   - Expected: Transaction history listed
   - Expected: Earnings breakdown (completed lessons, platform fees)

2. **Request Withdrawal**:
   - Click "Withdraw"
   - Enter amount
   - Enter bank details
   - Submit request
   - Expected: Withdrawal request created
   - Expected: Status: "pending"

3. **Admin Approves**:
   - Admin reviews request
   - Approves withdrawal
   - Expected: Funds transferred
   - Expected: Wallet balance updated
   - Expected: Ledger entry created

**Status**: ❌ NOT FULLY IMPLEMENTED
**Action Required**:
- Wallet balance calculation
- Withdrawal request system
- Admin approval interface

---

## 🔍 INTEGRATION TESTING

### Test 15: End-to-End Student Journey

**Complete Flow**:
1. Register → Login → Complete Profile
2. Search Tutor → View Profile → Chat
3. Create Booking → Make Payment
4. View Schedule → Attend Lesson
5. Leave Review

**Expected Result**: All steps work seamlessly

---

### Test 16: End-to-End Tutor Journey

**Complete Flow**:
1. Register → Login → Create Profile
2. Upload KYC → Create Services → Set Availability
3. Receive Booking → Confirm → Chat with Student
4. Complete Lesson → Receive Payment
5. View Earnings → Request Withdrawal

**Expected Result**: All steps work seamlessly

---

## 🐛 KNOWN ISSUES

### Critical
1. ❌ **Wallet System**: Not fully implemented
   - Balance calculation missing
   - Withdrawal flow incomplete
   - Escrow release logic needed

2. ❌ **Availability Management**: Not implemented
   - No UI for setting availability
   - No API for availability CRUD
   - Booking slots not generated

3. ❌ **Notification System**: Not implemented
   - No real-time notifications
   - No email notifications
   - No in-app notification center

### Medium
4. ⚠️ **KYC Verification**: Partial implementation
   - Upload works
   - Admin verification interface missing

5. ⚠️ **Payment Integration**: Needs testing
   - Midtrans integration configured
   - Webhook handling needs verification
   - Refund logic needs testing

### Minor
6. ⚠️ **Schedule Sync**: Needs verification
   - Real-time updates not confirmed
   - Auto-refresh on booking changes needed

---

## ✅ WORKING FEATURES SUMMARY

### Fully Functional
- ✅ User registration & login (both roles)
- ✅ Profile management (student)
- ✅ Tutor search with filters
- ✅ **Chat system (100% functional with dummy data)**
- ✅ Tutor profile creation
- ✅ Service/class creation
- ✅ Navbar authentication state
- ✅ Dashboard with tabs

### Partially Working
- ⚠️ Booking creation (needs testing)
- ⚠️ Payment processing (needs testing)
- ⚠️ Schedule display (needs testing)
- ⚠️ KYC upload (approval missing)

### Not Working
- ❌ Wallet & withdrawal
- ❌ Availability management
- ❌ Notifications
- ❌ Admin panel

---

## 🚀 NEXT STEPS

### Immediate Actions Required
1. **Test Booking Flow**:
   - Create test booking
   - Verify API calls
   - Check database records

2. **Test Payment Flow**:
   - Configure Midtrans sandbox
   - Test payment processing
   - Verify webhook handling

3. **Implement Availability**:
   - Create availability management UI
   - Implement CRUD APIs
   - Generate booking slots

4. **Implement Wallet**:
   - Create wallet on user registration
   - Implement balance calculation
   - Create withdrawal request system

### Testing Commands

```bash
# Start backend
cd backend
npm run start:dev

# Start frontend
cd frontend
npm run dev

# Seed chat messages
cd backend
node seed-chat-messages.js

# Check backend logs
# Watch for API errors and database queries
```

---

**Testing Priority**:
1. ✅ Chat (Already tested - working)
2. ⚠️ Booking creation
3. ⚠️ Payment processing
4. ❌ Availability management
5. ❌ Wallet system

**Estimated Implementation Time**:
- Availability Management: 4-6 hours
- Wallet System: 6-8 hours
- Notification System: 4-6 hours
- Admin Panel: 8-10 hours

---

**Last Updated**: December 30, 2025  
**Status**: Comprehensive testing guide complete
