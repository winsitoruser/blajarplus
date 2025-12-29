# Flow Diagrams & State Machines - Blajarplus

## Overview

Visual flow diagrams untuk semua user journeys dalam format box + arrows yang siap dipindahkan ke Figma/Whimsical/Miro.

---

## 🎓 Student Flows

### Flow 1: Landing → Explore → Tutor Detail

```
[ Landing Page ]
        ↓
[ Hero + Search Bar ]
        ↓
    ┌───────┴───────┐
    ↓               ↓
[ Search ]    [ Browse Category ]
    ↓               ↓
    └───────┬───────┘
            ↓
[ Search Results Page ]
        ↓
[ Apply Filters ]
(Subject | Level | Price | Location | Rating)
        ↓
[ Sorted Tutor List ]
        ↓
[ Click Tutor Card ]
        ↓
[ Tutor Detail Page ]
```

---

### Flow 2: Search & Filter

```
[ Search Bar ]
        ↓
[ Input Query: "Matematika SMA" ]
        ↓
[ Search Results ]
(47 tutors found)
        ↓
        ┌─────────────────────┐
        ↓                     ↓
[ Apply Filters ]      [ Sort Results ]
        ↓                     ↓
    Filters:              Sort by:
    • Subject             • Relevance
    • Level               • Rating ↓
    • Price Range         • Price ↑
    • Location            • Price ↓
    • Teaching Mode       • Experience
    • Rating              • Popularity
    • Availability
        ↓                     ↓
        └─────────┬───────────┘
                  ↓
        [ Updated Results ]
        (Real-time AJAX)
                  ↓
        [ Select Tutor ]
                  ↓
        [ Tutor Detail ]
```

---

### Flow 3: Tutor Detail → Chat or Book

```
[ Tutor Detail Page ]
        ↓
    View Sections:
    • Header (Photo, Name, Rating, Price)
    • About (Bio, Education, Experience)
    • Subjects & Levels
    • Availability Calendar
    • Reviews
    • Stats
        ↓
    User Decision:
        ↓
 ┌──────┴──────┬──────────┐
 ↓             ↓          ↓
[Chat]     [Book Now]  [Favorite]
 ↓             ↓          ↓
 │             │      [Login Check]
 │             │          ↓
 │             │      [Add to Favorites]
 │             │          ↓
 │             │      [Toast: "Saved!"]
 │             │
 │             ↓
 │      [Booking Modal]
 │             ↓
 │      See Flow 4
 │
 ↓
[Login Check]
 ↓
 ├─ Not Logged In → [Login Modal]
 │                        ↓
 │                   [Login/Register]
 │                        ↓
 └─ Logged In ────────────┘
                          ↓
                  [Chat Interface]
                          ↓
                  [Send Message]
                          ↓
                  [Tutor Responds]
                          ↓
                  [Continue Chat]
                          ↓
                  [CTA: Book Lesson]
```

---

### Flow 4: Booking Process

```
[ Book Now Button ]
        ↓
[ Booking Modal Opens ]
        ↓
┌───────────────────────────────┐
│ STEP 1: Date & Time           │
│                               │
│ [ Calendar Picker ]           │
│        ↓                      │
│ [ Select Available Date ]     │
│        ↓                      │
│ [ Time Slot Dropdown ]        │
│        ↓                      │
│ [ Duration Selection ]        │
│   ○ 60 min                    │
│   ○ 90 min                    │
│   ○ 120 min                   │
│        ↓                      │
│ [ Next Button ]               │
└───────────────────────────────┘
        ↓
┌───────────────────────────────┐
│ STEP 2: Lesson Details        │
│                               │
│ [ Subject Dropdown ]          │
│        ↓                      │
│ [ Level Dropdown ]            │
│        ↓                      │
│ [ Teaching Mode ]             │
│   ○ Online                    │
│   ○ Offline                   │
│        ↓                      │
│   ├─ If Online:               │
│   │   Info: Link will be sent│
│   │                           │
│   └─ If Offline:              │
│       [ Location Type ]       │
│         ○ Student Place       │
│         ○ Tutor Place         │
│         ○ Public Place        │
│       [ Address Input ]       │
│        ↓                      │
│ [ Notes (Optional) ]          │
│        ↓                      │
│ [ Next Button ]               │
└───────────────────────────────┘
        ↓
┌───────────────────────────────┐
│ STEP 3: Review & Confirm      │
│                               │
│ [ Booking Summary ]           │
│   • Tutor: [Name]             │
│   • Date: [Date]              │
│   • Time: [Time]              │
│   • Duration: [Duration]      │
│   • Subject: [Subject]        │
│   • Mode: [Online/Offline]    │
│                               │
│ [ Price Breakdown ]           │
│   Hourly Rate:    Rp XXX      │
│   Duration:       Rp XXX      │
│   Platform Fee:   Rp XXX      │
│   ─────────────────────       │
│   Total:          Rp XXX      │
│                               │
│ [ ] Terms & Conditions        │
│                               │
│ [Back] [Proceed to Payment]   │
└───────────────────────────────┘
        ↓
[ Authentication Check ]
        ↓
    ├─ Not Logged In
    │       ↓
    │   [Save Booking to Session]
    │       ↓
    │   [Redirect to Login]
    │       ↓
    │   [Login/Register]
    │       ↓
    └───────┘
            ↓
    Logged In
            ↓
[ Create Booking Record ]
(Status: pending_payment)
            ↓
[ Redirect to Payment Page ]
```

---

### Flow 5: Payment Process

```
[ Payment Page ]
        ↓
┌─────────────────────────────────────┐
│ Left: Booking Summary               │
│ Right: Payment Methods              │
└─────────────────────────────────────┘
        ↓
[ Select Payment Method ]
        ↓
    ┌───────┴───────┬───────────┬─────────┐
    ↓               ↓           ↓         ↓
[Virtual      [E-Wallet]    [QRIS]   [Card]
 Account]
    ↓               ↓           ↓         ↓
  Banks:        Providers:   Scan QR   Visa/MC
  • BCA         • GoPay                 /JCB
  • Mandiri     • OVO
  • BNI         • Dana
  • BRI         • ShopeePay
    ↓               ↓           ↓         ↓
    └───────┬───────┴───────────┴─────────┘
            ↓
[ Confirm Payment Button ]
        ↓
[ Create Payment Transaction ]
        ↓
[ Redirect to Payment Gateway ]
(Midtrans / Xendit)
        ↓
[ Complete Payment ]
        ↓
    ┌───────┴───────┐
    ↓               ↓
[Success]      [Failed]
    ↓               ↓
    │           [Error Page]
    │               ↓
    │           [Retry Button]
    │               ↓
    │           [Back to Payment]
    │
    ↓
[ Payment Webhook ]
        ↓
[ Update Payment Status: paid ]
        ↓
[ Update Booking Status: confirmed ]
        ↓
[ Payment Held in Escrow ]
        ↓
[ Send Notifications ]
  • Email to Student
  • Email to Tutor
  • In-app Notifications
        ↓
[ Redirect to Success Page ]
        ↓
[ Success Page ]
  ✓ Payment Successful!
  • Booking Details
  • Next Steps:
    - Chat with Tutor
    - View Booking
    - Back to Dashboard
```

---

### Flow 6: Chat with Tutor

```
[ Chat Button ]
        ↓
[ Login Check ]
        ↓
    ├─ Not Logged In → [Login Modal]
    │                        ↓
    │                   [Login/Register]
    │                        ↓
    └─ Logged In ────────────┘
                          ↓
              [ Check Conversation ]
                          ↓
              ├─ First Time
              │       ↓
              │   [Create Conversation]
              │       ↓
              └───────┘
                      ↓
              [ Chat Interface ]
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
    [Left Sidebar]          [Main Chat]
          ↓                       ↓
  Conversations List      Chat Window
  • Search                • Header
  • Filter                • Messages
  • Unread Badge          • Input Box
          ↓                       ↓
          └───────────┬───────────┘
                      ↓
              [ Send Message ]
                      ↓
          ┌───────────┴───────────┐
          ↓                       ↓
      [Text]                [Attachment]
          ↓                       ↓
    Type & Send           Upload File
          ↓                       ↓
          └───────────┬───────────┘
                      ↓
          [ Real-time Sync ]
          (WebSocket)
                      ↓
          [ Tutor Receives ]
                      ↓
          [ Tutor Responds ]
                      ↓
          [ Student Receives ]
                      ↓
          [ Continue Chat ]
```

---

### Flow 7: Dashboard → Manage Bookings

```
[ Student Dashboard ]
        ↓
    Tab Navigation:
        ↓
 ┌──────┼──────┬──────┬──────┬──────┐
 ↓      ↓      ↓      ↓      ↓      ↓
[Over [Book [Prog [Msgs [Fav [Prof
view] ings] ress] ]    s]   ile]
 ↓
 │
 ↓
[Overview Tab]
 • Welcome
 • Upcoming Lessons (Next 7 days)
 • Quick Stats
 • Recent Notifications
        ↓
[Bookings Tab]
        ↓
[ Filter & Sort ]
  Filters:
  • Status: All/Upcoming/Completed/Cancelled
  • Date Range
  • Subject
        ↓
[ Booking Cards List ]
        ↓
[ Select Booking ]
        ↓
    ┌───────┴───────┬───────────┬─────────┐
    ↓               ↓           ↓         ↓
[View         [Chat]      [Cancel]   [Review]
Details]
    ↓               ↓           ↓         ↓
    │               │           │         │
    │               │           │     (Only if
    │               │           │     completed)
    │               │           │         ↓
    │               │           │     [Review
    │               │           │      Modal]
    │               │           │         ↓
    │               │           │     [Rating
    │               │           │      1-5★]
    │               │           │         ↓
    │               │           │     [Comment]
    │               │           │         ↓
    │               │           │     [Submit]
    │               │           │
    │               │       (Only if
    │               │       >24h before)
    │               │           ↓
    │               │       [Cancel
    │               │        Modal]
    │               │           ↓
    │               │       [Reason]
    │               │           ↓
    │               │       [Confirm]
    │               │           ↓
    │               │       [Refund
    │               │        Process]
    │               │
    │           [Chat
    │           Interface]
    │
    ↓
[Details Modal]
  • Full Booking Info
  • Payment Status
  • Meeting Link/Location
  • Notes
  • Progress Logs
```

---

### Flow 8: Cancel Booking

```
[ Cancel Button ]
        ↓
[ Cancellation Modal ]
        ↓
[ Show Booking Info ]
        ↓
[ Check Cancellation Time ]
        ↓
    ┌───────┴───────┬───────────┐
    ↓               ↓           ↓
[>24h before] [<24h before] [<2h before]
    ↓               ↓           ↓
Full Refund    50% Refund   No Refund
(100%)         (50%)        (0%)
    ↓               ↓           ↓
    └───────┬───────┴───────────┘
            ↓
[ Show Refund Amount ]
        ↓
[ Cancellation Reason ]
  Dropdown:
  • Changed mind
  • Schedule conflict
  • Found another tutor
  • Price too high
  • Other (text input)
        ↓
[ Confirmation Checkbox ]
"I'm sure I want to cancel"
        ↓
[ Confirm Button ]
        ↓
[ Update Booking Status: cancelled ]
        ↓
[ Process Refund ]
        ↓
[ Notify Tutor ]
        ↓
[ Release Slot ]
        ↓
[ Send Confirmation Email ]
        ↓
[ Redirect to Dashboard ]
        ↓
[ Toast: "Booking cancelled" ]
```

---

## 👨‍🏫 Tutor Flows

### Flow 1: Registration & Profile Setup

```
[ Landing Page ]
        ↓
[ "Daftar Sebagai Pengajar" ]
        ↓
[ Registration Page ]
        ↓
┌─────────────────────────────┐
│ STEP 1: Basic Info          │
│                             │
│ [ Full Name ]               │
│ [ Email ]                   │
│ [ Phone + OTP ]             │
│ [ Password ]                │
│ [ Confirm Password ]        │
│ [ ] Terms & Conditions      │
│                             │
│ [ Next ]                    │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ STEP 2: Teaching Info       │
│                             │
│ [ Headline ]                │
│ [ Subjects (Multi-select) ] │
│   For each subject:         │
│   [ Levels (Checkboxes) ]   │
│                             │
│ [ Teaching Mode ]           │
│   [ ] Online                │
│   [ ] Offline               │
│     If Offline:             │
│     [ Location ]            │
│                             │
│ [ Hourly Rate ]             │
│   Slider: Rp 50k - 500k     │
│                             │
│ [ Next ]                    │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ STEP 3: About You           │
│                             │
│ [ Profile Picture Upload ]  │
│ [ Bio (Rich Text) ]         │
│ [ Education Background ]    │
│ [ Experience Years ]        │
│ [ Teaching Style ]          │
│ [ Languages ]               │
│ [ Intro Video (Optional) ]  │
│                             │
│ [ Next ]                    │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ STEP 4: Verification Docs   │
│                             │
│ Required:                   │
│ [ Upload KTP ]              │
│ [ Upload Education Cert ]   │
│                             │
│ Optional:                   │
│ [ Teaching Certificate ]    │
│ [ Portfolio ]               │
│                             │
│ [Skip] [Submit for Review]  │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ STEP 5: Review & Submit     │
│                             │
│ [ Profile Preview ]         │
│ [ Checklist ]               │
│   ✓ Basic info              │
│   ✓ Teaching info           │
│   ✓ Profile complete        │
│   ⚠ Docs pending (optional) │
│                             │
│ [ Create Profile ]          │
└─────────────────────────────┘
        ↓
[ Create User Account ]
(role: tutor)
        ↓
[ Create Tutor Profile ]
(status: draft or pending)
        ↓
[ Send Welcome Email ]
        ↓
[ Pending Verification Page ]
  ✓ Profile Created!
  • Status: Pending Review
  • Estimated: 1-3 days
  • Next Steps:
    - Set Availability
    - Complete Profile
    - Go to Dashboard
        ↓
[ Admin Reviews ]
        ↓
    ┌───────┴───────┐
    ↓               ↓
[Approved]     [Rejected]
    ↓               ↓
    │           [Email with Reason]
    │               ↓
    │           [Resubmit Option]
    │
    ↓
[Email: Approved!]
    ↓
[Badge: ✓ Verified]
    ↓
[Profile Status: active]
    ↓
[Can Receive Bookings]
```

---

### Flow 2: Set Availability

```
[ Tutor Dashboard ]
        ↓
[ Availability Tab ]
        ↓
[ Weekly Calendar View ]
        ↓
┌─────────────────────────────┐
│     Mon Tue Wed Thu Fri ... │
│ 08  [ ] [ ] [ ] [ ] [ ] ... │
│ 09  [ ] [ ] [ ] [ ] [ ] ... │
│ 10  [✓] [✓] [✓] [✓] [✓] ... │
│ ... ... ... ... ... ... ... │
│ 19  [✓] [✓] [✓] [✓] [✓] ... │
│ 20  [✓] [✓] [✓] [✓] [✓] ... │
└─────────────────────────────┘
        ↓
[ Add Availability Button ]
        ↓
[ Modal Opens ]
        ↓
┌─────────────────────────────┐
│ Add Availability            │
│                             │
│ [ Select Days ]             │
│   [✓] Mon [✓] Tue [✓] Wed   │
│   [✓] Thu [✓] Fri [ ] Sat   │
│   [ ] Sun                   │
│                             │
│ [ Time Range ]              │
│   Start: [19:00]            │
│   End:   [21:00]            │
│                             │
│ [ Slot Duration ]           │
│   ○ 60 min                  │
│   ○ 90 min                  │
│   ○ 120 min                 │
│                             │
│ [✓] Repeat weekly           │
│                             │
│ [Cancel] [Save]             │
└─────────────────────────────┘
        ↓
[ Save to Database ]
        ↓
[ Update Calendar ]
        ↓
[ Toast: "Availability added!" ]
        ↓
[ Slots Now Bookable ]
```

---

### Flow 3: Receive & Manage Bookings

```
[ New Booking Created ]
(by student)
        ↓
[ Send Notifications ]
  • Push Notification
  • Email
  • In-app Badge
  • Sound Alert
        ↓
[ Tutor Receives Notification ]
        ↓
[ Click Notification ]
        ↓
[ Booking Request Card ]
        ↓
┌─────────────────────────────┐
│ NEW BOOKING REQUEST         │
│                             │
│ Student: [Name]             │
│ Date: [Date]                │
│ Time: [Time]                │
│ Duration: [Duration]        │
│ Subject: [Subject]          │
│ Mode: [Online/Offline]      │
│ Notes: [Student notes]      │
│                             │
│ Earnings: Rp XXX            │
│ (After 10% platform fee)    │
│                             │
│ [Accept] [Decline]          │
└─────────────────────────────┘
        ↓
    ┌───────┴───────┐
    ↓               ↓
[Accept]       [Decline]
    ↓               ↓
    │           [Decline Modal]
    │               ↓
    │           [Reason Required]
    │             Dropdown:
    │             • Schedule conflict
    │             • Not available
    │             • Outside area
    │             • Not my expertise
    │             • Other
    │               ↓
    │           [Message to Student]
    │           (Optional)
    │               ↓
    │           [Confirm Decline]
    │               ↓
    │           [Update Status: cancelled]
    │               ↓
    │           [Process Refund]
    │               ↓
    │           [Notify Student]
    │               ↓
    │           [Release Slot]
    │
    ↓
[Confirm Accept]
    ↓
[Update Booking Status: confirmed]
    ↓
[Notify Student]
    ↓
[Update Calendar]
    ↓
[Generate Meeting Link]
(if online)
    ↓
[Set Reminders]
(H-1, H-3h, H-30m)
    ↓
[Toast: "Booking confirmed!"]
        ↓
        ↓
[ Before Lesson ]
        ↓
[ Preparation Checklist ]
  ✓ Review student notes
  ✓ Prepare materials
  ✓ Test meeting link
  ✓ Confirm location
        ↓
[ During Lesson ]
        ↓
[ Optional: Mark "In Progress" ]
        ↓
[ After Lesson ]
        ↓
[ Mark as Completed ]
        ↓
[ Prompt: Add Progress Log ]
        ↓
[ Payment Released from Escrow ]
        ↓
[ Earnings Updated ]
```

---

### Flow 4: Chat with Students

```
[ Chat Entry Points ]
        ↓
    ┌───────┴───────┬───────────┐
    ↓               ↓           ↓
[Booking      [Dashboard]  [Notification]
 Detail]
    ↓               ↓           ↓
    └───────┬───────┴───────────┘
            ↓
[ Chat Interface ]
        ↓
┌─────────────────────────────────┐
│ Left: Conversations             │
│ Right: Chat Window              │
└─────────────────────────────────┘
        ↓
[ Send/Receive Messages ]
        ↓
[ Real-time Sync ]
        ↓
[ Quick Actions ]
  • View Student Profile
  • View Related Bookings
  • Schedule New Lesson
        ↓
[ Quick Replies ]
  • "Terima kasih sudah booking!"
  • "Saya confirm untuk [date]"
  • "Ada materi khusus?"
  • "Link meeting: [link]"
```

---

### Flow 5: Add Progress Log

```
[ After Lesson Completed ]
        ↓
[ Prompt: Add Progress Log ]
        ↓
[ Progress Log Form ]
        ↓
┌─────────────────────────────┐
│ Lesson Info (Auto-filled)   │
│ • Date, Time, Duration      │
│ • Student Name              │
│ • Subject                   │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Topics Covered              │
│ [ Tag Input or Textarea ]   │
│ Examples:                   │
│ • Trigonometri              │
│ • Limit Fungsi              │
│ • Turunan                   │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Student Understanding       │
│ [ Rating 1-5 Stars ]        │
│ 1★ Needs much improvement   │
│ 2★ Needs improvement        │
│ 3★ Satisfactory             │
│ 4★ Good                     │
│ 5★ Excellent                │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Homework Assigned           │
│ [ Textarea ]                │
│ [ Attach Files (Optional) ] │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Notes & Observations        │
│ [ Textarea ]                │
│ • Strengths                 │
│ • Areas for Improvement     │
│ • Recommendations           │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Attachments                 │
│ [ Upload Files ]            │
│ • Lesson materials          │
│ • Photos of work            │
│ Max 5 files, 10MB each      │
└─────────────────────────────┘
        ↓
[ Save as Draft ] [ Save & Send ]
        ↓
[ Save to Database ]
        ↓
[ Notify Student ]
  • Email
  • In-app
        ↓
[ Visible in Student Dashboard ]
        ↓
[ Toast: "Progress log saved!" ]
```

---

### Flow 6: Earnings & Withdrawals

```
[ Tutor Dashboard ]
        ↓
[ Earnings Tab ]
        ↓
┌─────────────────────────────┐
│ Earnings Overview           │
│                             │
│ Total Earnings: Rp 5.45M    │
│ Available: Rp 1.2M          │
│ Pending: Rp 450k            │
│ This Month: Rp 2.1M         │
└─────────────────────────────┘
        ↓
[ Earnings Chart ]
(Last 6 months)
        ↓
[ Transaction History ]
(Table with all transactions)
        ↓
[ Withdraw Button ]
        ↓
[ Withdrawal Modal ]
        ↓
┌─────────────────────────────┐
│ Withdraw Funds              │
│                             │
│ Available: Rp 1,200,000     │
│                             │
│ Amount: [Input]             │
│ Min: Rp 100,000             │
│                             │
│ Method:                     │
│ ○ Bank Transfer             │
│   [ Select Bank ]           │
│   [ Account Number ]        │
│   [ Account Name ]          │
│                             │
│ ○ E-Wallet                  │
│   [ Select Provider ]       │
│   [ Phone Number ]          │
│                             │
│ Fee: Rp 0 (Bank) / Rp 2.5k  │
│ Net Amount: Rp 1,200,000    │
│                             │
│ Processing: 1-3 days        │
│                             │
│ [Cancel] [Withdraw]         │
└─────────────────────────────┘
        ↓
[ Create Withdrawal Request ]
        ↓
[ Deduct from Balance ]
        ↓
[ Create Ledger Entry ]
        ↓
[ Send to Payment Provider ]
        ↓
[ Confirmation Page ]
  ✓ Withdrawal Requested!
  • ID: #WD-20240115-001
  • Processing: 1-3 days
        ↓
[ Email Confirmation ]
        ↓
[ Status Tracking ]
  Pending → Processing → Completed
        ↓
[ Notify When Completed ]
```

---

## 👤 Admin Flows

### Flow 1: Tutor Verification

```
[ Admin Dashboard ]
        ↓
[ Verification Tab ]
        ↓
[ Pending Verifications Queue ]
        ↓
[ Filter & Sort ]
  • Status
  • Date Submitted
  • Subject Category
        ↓
[ Tutor Card List ]
        ↓
[ Select Tutor to Review ]
        ↓
[ Verification Page ]
        ↓
┌─────────────────────────────┐
│ Tutor Profile Preview       │
│ (As students will see)      │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Documents Section           │
│                             │
│ [ KTP ]                     │
│   Image Viewer              │
│   Zoom, Rotate, Download    │
│                             │
│ [ Education Certificate ]   │
│   PDF/Image Viewer          │
│                             │
│ [ Teaching Certificate ]    │
│   (Optional)                │
│                             │
│ [ Portfolio ]               │
│   (Optional)                │
└─────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ Verification Checklist      │
│ [ ] ID matches name         │
│ [ ] Education cert valid    │
│ [ ] Teaching cert authentic │
│ [ ] Profile complete        │
│ [ ] No red flags            │
└─────────────────────────────┘
        ↓
[ Internal Notes ]
(Visible to other admins)
        ↓
    ┌───────┴───────┐
    ↓               ↓
[Approve]      [Reject]
    ↓               ↓
    │           [Reject Modal]
    │               ↓
    │           [Reason (Required)]
    │             Checkboxes:
    │             • Unclear docs
    │             • Info mismatch
    │             • Invalid cert
    │             • Incomplete
    │             • Other
    │               ↓
    │           [Message to Tutor]
    │           (Explain what to fix)
    │               ↓
    │           [Confirm Reject]
    │               ↓
    │           [Update Status: rejected]
    │               ↓
    │           [Email Tutor]
    │               ↓
    │           [Tutor Can Resubmit]
    │               ↓
    │           [Audit Log]
    │
    ↓
[Confirm Approve]
    ↓
[Update Status: verified]
    ↓
[Add Verified Badge]
    ↓
[Set Profile: active]
    ↓
[Email Tutor: Approved!]
    ↓
[In-app Notification]
    ↓
[Audit Log]
    ↓
[Tutor Can Receive Bookings]
```

---

### Flow 2: Monitoring & Dispute Resolution

```
[ Admin Dashboard ]
        ↓
[ Bookings Tab ]
        ↓
┌─────────────────────────────┐
│ Stats Dashboard             │
│ • Total Bookings Today: 45  │
│ • Revenue Today: Rp 12.5M   │
│ • Pending Payments: 12      │
│ • Active Disputes: 3        │
└─────────────────────────────┘
        ↓
[ Filter Bookings ]
  • Date Range
  • Status
  • Subject
  • Tutor
  • Student
        ↓
[ Bookings Table ]
        ↓
[ Select Disputed Booking ]
        ↓
[ Dispute Resolution Page ]
        ↓
┌─────────────────────────────┐
│ Dispute Information         │
│                             │
│ Reported By: Student/Tutor  │
│ Reason: [Reason text]       │
│ Date Reported: [Date]       │
│ Evidence: [Attachments]     │
└─────────────────────────────┘
        ↓
[ Investigation Tools ]
  • View Chat History
  • View Booking Details
  • View Progress Logs
  • View Payment Status
        ↓
[ Admin Decision ]
        ↓
    ┌───────┴───────┬───────────┬─────────┐
    ↓               ↓           ↓         ↓
[Refund      [Release    [Cancel   [Warn/Ban
 to Student]  to Tutor]   Booking]  User]
    ↓               ↓           ↓         ↓
    └───────┬───────┴───────────┴─────────┘
            ↓
[ Resolution Form ]
  • Decision: [Dropdown]
  • Reason: [Textarea]
  • Action Taken: [Checkboxes]
  • Internal Notes: [Textarea]
        ↓
[ Save & Notify Parties ]
        ↓
[ Update Booking Status ]
        ↓
[ Process Refund/Payment ]
        ↓
[ Send Notifications ]
  • Email to Student
  • Email to Tutor
        ↓
[ Audit Log ]
        ↓
[ Case Closed ]
```

---

### Flow 3: Content Moderation

```
[ Admin Dashboard ]
        ↓
[ Moderation Tab ]
        ↓
[ Reported Content Queue ]
        ↓
    Tabs:
    ┌───────┬───────┬───────┬───────┐
    ↓       ↓       ↓       ↓       ↓
[Reviews][Messages][Profiles][All]
    ↓
    └───────┬───────┴───────┴───────┘
            ↓
[ Report Card ]
        ↓
┌─────────────────────────────┐
│ REPORTED REVIEW             │
│                             │
│ Reported By: [Name]         │
│ Reason: Inappropriate       │
│ Date: [Date]                │
│                             │
│ Review Content:             │
│ "[Review text]"             │
│ Rating: [Stars]             │
│                             │
│ Tutor: [Name]               │
│                             │
│ [View Context] [Take Action]│
└─────────────────────────────┘
        ↓
[ View Full Context ]
  • Booking details
  • Chat history
  • Other reviews by user
        ↓
[ Moderation Decision ]
        ↓
    ┌───────┴───────┬───────┬───────┬─────────┐
    ↓               ↓       ↓       ↓         ↓
[Keep]         [Hide]  [Delete] [Warn]   [Ban User]
    ↓               ↓       ↓       ↓         ↓
Dismiss      Hide from  Remove  Send    Permanent
Report       Public    Forever Warning  Ban
    ↓               ↓       ↓       ↓         ↓
    └───────┬───────┴───────┴───────┴─────────┘
            ↓
[ Reason for Decision ]
(Textarea, will be logged)
        ↓
[ Confirm Action ]
        ↓
[ Update Content Status ]
        ↓
[ Notify Reporter ]
        ↓
[ Notify Content Author ]
(if warned/banned)
        ↓
[ Audit Log ]
        ↓
[ Case Closed ]
```

---

## Edge Case Flows

### Edge Case 1: Student Cancel (Refund Logic)

```
[ Student Cancels Booking ]
        ↓
[ Check Cancellation Time ]
        ↓
    ┌───────┴───────┬───────────┐
    ↓               ↓           ↓
[>24h before] [<24h before] [<2h before]
    ↓               ↓           ↓
Full Refund    50% Refund   No Refund
Rp 247,500     Rp 123,750   Rp 0
    ↓               ↓           ↓
    │               │           │
    │               │       Tutor gets
    │               │       full payment
    │               │           ↓
    │               │       [Release to
    │               │        Tutor Wallet]
    │               │
    │           [Split Payment]
    │               ↓
    │           Student: 50%
    │           Tutor: 40%
    │           Platform: 10%
    │               ↓
    │           [Process Refund]
    │               ↓
    │           [Release to Tutor]
    │
    ↓
[Full Refund to Student]
    ↓
[No Payment to Tutor]
    ↓
    └───────┬───────┴───────────┘
            ↓
[ Update Booking Status: cancelled ]
        ↓
[ Update Payment Status ]
        ↓
[ Create Ledger Entries ]
        ↓
[ Notify Tutor ]
        ↓
[ Release Slot ]
        ↓
[ Email Confirmations ]
```

---

### Edge Case 2: Tutor No-Show

```
[ Lesson Time Passed ]
        ↓
[ Student Reports No-Show ]
        ↓
[ Admin Investigation ]
        ↓
    ┌───────┴───────┐
    ↓               ↓
[Tutor Fault]  [Student Fault]
    ↓               ↓
    │           [No Action]
    │               ↓
    │           [Dismiss Report]
    │
    ↓
[ Confirmed No-Show ]
        ↓
[ Full Refund to Student ]
        ↓
[ Bonus Credit: 20% ]
(Goodwill gesture)
        ↓
[ No Payment to Tutor ]
        ↓
[ Tutor Penalty ]
  • Warning (1st offense)
  • Suspension (2nd offense)
  • Permanent Ban (3rd offense)
        ↓
[ Update Tutor Metrics ]
  • No-show count++
  • Reliability score--
        ↓
[ Notify Both Parties ]
        ↓
[ Audit Log ]
```

---

## State Machine: Booking Status

```
                    [ draft ]
                        ↓
              (Student creates booking)
                        ↓
                [ pending_payment ]
                        ↓
            ┌───────────┴───────────┐
            ↓                       ↓
    (Payment success)       (Payment failed/expired)
            ↓                       ↓
      [ confirmed ]            [ cancelled ]
            ↓                       ↓
    ┌───────┴───────┐           [END]
    ↓               ↓
(Lesson      (Cancelled by
 happens)     student/tutor)
    ↓               ↓
    │         [ cancelled ]
    │               ↓
    │           [END]
    ↓
[ completed ]
    ↓
(Payment released)
    ↓
[END]

Alternative paths:
- [ confirmed ] → [ reschedule_requested ] → [ confirmed ]
- [ confirmed ] → [ no_show ] → [END]
- [ confirmed ] → [ disputed ] → (Admin resolves) → [ completed ] or [ cancelled ]
```

---

## State Machine: Payment Status

```
                  [ pending ]
                        ↓
              (User pays)
                        ↓
                   [ paid ]
                        ↓
            (Held in escrow)
                        ↓
        ┌───────────────┴───────────────┐
        ↓                               ↓
(Lesson completed)              (Booking cancelled)
        ↓                               ↓
   [ released ]                    [ refunded ]
        ↓                               ↓
(To tutor wallet)               (To student account)
        ↓                               ↓
      [END]                           [END]

Alternative paths:
- [ pending ] → (Timeout) → [ expired ] → [END]
- [ pending ] → (Payment fails) → [ failed ] → [END]
- [ paid ] → (Dispute) → (Admin decides) → [ refunded ] or [ released ]
```

---

## State Machine: Tutor Verification Status

```
                   [ none ]
                        ↓
        (Tutor uploads documents)
                        ↓
                  [ pending ]
                        ↓
              (Admin reviews)
                        ↓
            ┌───────────┴───────────┐
            ↓                       ↓
      [ approved ]              [ rejected ]
            ↓                       ↓
    (Badge added)           (Email with reason)
            ↓                       ↓
    Profile: active         (Tutor can resubmit)
            ↓                       ↓
      [END]                   [ pending ]
                                    ↓
                            (Loop back to review)
```

---

## Summary

Semua flow diagrams sudah siap untuk:
- **UI/UX Designer:** Visual reference untuk wireframing
- **Frontend Developer:** Implementation guide untuk setiap flow
- **Backend Developer:** API endpoints dan business logic mapping
- **QA Engineer:** Test scenarios dan edge cases
- **Product Manager:** Feature validation dan user journey review

**Next Steps:**
1. Create wireframes based on these flows
2. Map API endpoints for each flow
3. Define component hierarchy
4. Set up development tasks
