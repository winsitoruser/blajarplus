# Pages & Components Specification - Blajarplus

## Overview

Comprehensive specification untuk semua pages dan reusable components dalam platform Blajarplus.

---

## Page Categories

1. **Public Pages** (5 pages)
2. **Authentication Pages** (3 pages)
3. **Student Dashboard** (6 pages)
4. **Tutor Dashboard** (7 pages)
5. **Admin Panel** (6 pages)
6. **Modals** (5 modals)
7. **Layouts** (2 layouts)
8. **Reusable Components** (15+ components)

---

## 1. Public Pages

### 1.1 Homepage (`/`)

**Priority:** MVP

**Purpose:** Landing page untuk attract users dan provide search functionality

**Sections:**
- Navigation Bar
- Hero Section
- Search Bar (prominent)
- Featured Categories
- Featured Tutors
- How It Works
- Testimonials
- CTA Section
- Footer

**Components Used:**
- `Navbar`
- `SearchBar`
- `CategoryCard`
- `TutorCard`
- `TestimonialCard`
- `Footer`

**User Flow:** Landing → Explore → Search

**Related Flows:** Flow 0 (Student)

**Notes:**
- Mobile-first design
- Sky blue color scheme
- Fast loading (< 2s)
- SEO optimized

---

### 1.2 Search Results Page (`/search`)

**Priority:** MVP

**Purpose:** Display filtered tutor results based on search query

**Layout:**
- Left Sidebar: Filters
- Main Content: Tutor Cards Grid/List
- Top Bar: Search input, Sort dropdown, View toggle

**Sections:**
- Search Bar (sticky)
- Filter Sidebar
  - Subject Filter
  - Level Filter
  - Price Range Slider
  - Location Filter
  - Teaching Mode Filter
  - Rating Filter
  - Availability Filter
- Results Header (count, sort)
- Tutor Cards Grid
- Pagination

**Components Used:**
- `SearchBar`
- `FilterSidebar`
- `TutorCard`
- `SortDropdown`
- `Pagination`

**User Flow:** Search → Filter → Select Tutor

**Related Flows:** Flow 1, Flow 2 (Student)

**State Management:**
- Search query
- Active filters
- Sort option
- Current page
- Results data

**API Endpoints:**
- `GET /api/tutors/search`

---

### 1.3 Tutor Profile Page (`/tutor/:id`)

**Priority:** MVP

**Purpose:** Display comprehensive tutor information

**Sections:**
- Header Section
  - Profile photo
  - Name, headline
  - Rating & reviews count
  - Hourly rate
  - Location
  - Teaching mode
  - Verified badge
  - Response rate & time
- Action Buttons
  - "Pesan Sekarang" (primary)
  - "Chat Tutor" (secondary)
  - "♡ Simpan" (tertiary)
- About Section
  - Bio
  - Education
  - Experience
  - Teaching style
  - Languages
  - Intro video (optional)
- Subjects & Levels Table
- Availability Calendar
- Reviews Section
  - Rating breakdown
  - Recent reviews
  - "Load More" button
- Stats & Achievements

**Components Used:**
- `TutorHeader`
- `ActionButtons`
- `AboutSection`
- `SubjectsTable`
- `AvailabilityCalendar`
- `ReviewsSection`
- `RatingBreakdown`
- `ReviewCard`
- `StatsCard`

**User Flow:** View Profile → Chat/Book → Payment

**Related Flows:** Flow 2, Flow 3 (Student)

**State Management:**
- Tutor data
- Availability data
- Reviews data
- Favorite status

**API Endpoints:**
- `GET /api/tutors/:id`
- `GET /api/tutors/:id/availability`
- `GET /api/tutors/:id/reviews`
- `POST /api/favorites`

---

### 1.4 How It Works Page (`/how-it-works`)

**Priority:** Phase 1

**Purpose:** Explain platform features and process

**Sections:**
- For Students
  - Step 1: Search
  - Step 2: Book
  - Step 3: Learn
  - Step 4: Review
- For Tutors
  - Step 1: Register
  - Step 2: Verify
  - Step 3: Teach
  - Step 4: Earn
- FAQ Section

**Components Used:**
- `StepCard`
- `AccordionFAQ`

---

### 1.5 Pricing Page (`/pricing`)

**Priority:** Phase 1

**Purpose:** Explain pricing structure and fees

**Sections:**
- Platform Fee Explanation
- Payment Methods
- Refund Policy
- Tutor Earnings Breakdown

**Components Used:**
- `PricingCard`
- `FeatureList`

---

## 2. Authentication Pages

### 2.1 Login Page (`/login`)

**Priority:** MVP

**Purpose:** User authentication

**Form Fields:**
- Email/Phone
- Password
- Remember me (checkbox)

**Actions:**
- Login button
- "Forgot Password?" link
- "Login with Google" button
- "Don't have an account? Register" link

**Components Used:**
- `AuthLayout`
- `LoginForm`
- `SocialLoginButton`

**User Flow:** Login → Dashboard

**Related Flows:** All authenticated flows

**State Management:**
- Form data
- Loading state
- Error messages

**API Endpoints:**
- `POST /api/auth/login`
- `POST /api/auth/google`

**Validation:**
- Email/phone format
- Password required
- Error handling

---

### 2.2 Register Student Page (`/register/student`)

**Priority:** MVP

**Purpose:** Student account creation

**Form Fields:**
- Full Name
- Email
- Phone
- Password
- Confirm Password
- Terms & Conditions (checkbox)

**Actions:**
- Register button
- "Login with Google" button
- "Already have an account? Login" link

**Components Used:**
- `AuthLayout`
- `RegisterForm`
- `SocialLoginButton`

**User Flow:** Register → Email Verification → Dashboard

**API Endpoints:**
- `POST /api/auth/register/student`

---

### 2.3 Register Tutor Page (`/register/tutor`)

**Priority:** MVP

**Purpose:** Tutor account creation (multi-step)

**Steps:**
1. Basic Info
2. Teaching Info
3. About You
4. Verification Docs
5. Review & Submit

**Components Used:**
- `AuthLayout`
- `MultiStepForm`
- `StepIndicator`
- `FileUpload`

**User Flow:** Register → Pending Verification → Dashboard

**Related Flows:** Flow 1 (Tutor)

**State Management:**
- Current step
- Form data (all steps)
- Uploaded files

**API Endpoints:**
- `POST /api/auth/register/tutor`
- `POST /api/upload`

---

## 3. Student Dashboard

### 3.1 Overview Tab (`/dashboard/student`)

**Priority:** MVP

**Purpose:** Dashboard home with quick stats and upcoming lessons

**Sections:**
- Welcome Header
- Profile Completion Progress
- Upcoming Lessons (next 7 days)
- Quick Stats Cards
  - Total lessons completed
  - Total hours learned
  - Favorite subjects
  - Current streak
- Recent Notifications

**Components Used:**
- `DashboardLayout`
- `WelcomeHeader`
- `ProgressBar`
- `UpcomingLessonCard`
- `StatsCard`
- `NotificationList`

**User Flow:** Dashboard → View Details

**API Endpoints:**
- `GET /api/dashboard/student/stats`
- `GET /api/bookings?status=upcoming&limit=5`
- `GET /api/notifications?limit=5`

---

### 3.2 Bookings Tab (`/dashboard/student/bookings`)

**Priority:** MVP

**Purpose:** Manage all bookings

**Sections:**
- Filter Bar
  - Status filter (All/Upcoming/Completed/Cancelled)
  - Date range picker
  - Subject filter
- View Toggle (List/Calendar)
- Booking Cards List
- Pagination

**Components Used:**
- `DashboardLayout`
- `FilterBar`
- `BookingCard`
- `BookingDetailModal`
- `CancelBookingModal`
- `ReviewModal`
- `CalendarView`

**User Flow:** View Bookings → Actions (View/Chat/Cancel/Review)

**Related Flows:** Flow 6, Flow 7, Flow 8 (Student)

**State Management:**
- Bookings data
- Active filters
- Selected booking
- Modal states

**API Endpoints:**
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `PUT /api/bookings/:id/cancel`
- `POST /api/reviews`

---

### 3.3 Progress Tab (`/dashboard/student/progress`)

**Priority:** Phase 4

**Purpose:** Track learning progress by subject

**Sections:**
- Subject-wise Progress Cards
  - Total lessons
  - Total hours
  - Topics covered
  - Average understanding
  - Recent homework
- Progress Timeline (per subject)
- Export as PDF button

**Components Used:**
- `DashboardLayout`
- `ProgressCard`
- `ProgressTimeline`
- `TopicTag`

**User Flow:** View Progress → Export

**Related Flows:** Flow 6 (Student)

**API Endpoints:**
- `GET /api/progress/student/:studentId`
- `GET /api/progress/export/:studentId`

---

### 3.4 Messages Tab (`/dashboard/student/messages`)

**Priority:** Phase 2

**Purpose:** Chat with tutors

**Layout:**
- Left Sidebar: Conversations List
- Main Area: Chat Window

**Components Used:**
- `DashboardLayout`
- `ConversationList`
- `ChatWindow`
- `MessageBubble`
- `MessageInput`

**User Flow:** Select Conversation → Chat

**Related Flows:** Flow 5 (Student)

**API Endpoints:**
- `GET /api/conversations`
- `GET /api/messages/:conversationId`
- `POST /api/messages`
- WebSocket: `ws://api/chat`

---

### 3.5 Favorites Tab (`/dashboard/student/favorites`)

**Priority:** Phase 2

**Purpose:** Manage favorite tutors

**Sections:**
- Favorites Grid
- Empty State (if no favorites)

**Components Used:**
- `DashboardLayout`
- `TutorCard`
- `EmptyState`

**User Flow:** View Favorites → View Profile/Remove

**API Endpoints:**
- `GET /api/favorites`
- `DELETE /api/favorites/:tutorId`

---

### 3.6 Profile Tab (`/dashboard/student/profile`)

**Priority:** MVP

**Purpose:** Manage user profile and settings

**Sections:**
1. Personal Information
   - Full name
   - Email (verified badge)
   - Phone (verified badge)
   - Gender
   - Birthdate
   - Edit button
2. Addresses
   - List of saved addresses
   - Add new address
   - Edit/Delete actions
3. Account Settings
   - Change password
   - Email notifications
   - Push notifications
   - Language
4. Payment Methods
   - Saved payment methods
   - Add new method
5. Danger Zone
   - Deactivate account
   - Delete account

**Components Used:**
- `DashboardLayout`
- `ProfileForm`
- `AddressCard`
- `AddressModal`
- `SettingsForm`
- `DangerZone`

**API Endpoints:**
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/addresses`
- `POST /api/addresses`
- `PUT /api/addresses/:id`
- `DELETE /api/addresses/:id`

---

## 4. Tutor Dashboard

### 4.1 Overview Tab (`/dashboard/tutor`)

**Priority:** MVP

**Purpose:** Tutor dashboard home

**Sections:**
- Welcome Header
- Profile Status (Draft/Pending/Active)
- Verification Status
- Today's Lessons
- Quick Stats
  - Total earnings this month
  - Pending bookings
  - Average rating
  - Total students
- Recent Notifications

**Components Used:**
- `DashboardLayout`
- `WelcomeHeader`
- `StatusBadge`
- `TodayLessonCard`
- `StatsCard`
- `NotificationList`

**API Endpoints:**
- `GET /api/dashboard/tutor/stats`
- `GET /api/bookings?date=today`

---

### 4.2 Bookings Tab (`/dashboard/tutor/bookings`)

**Priority:** MVP

**Purpose:** Manage bookings and schedule

**Sections:**
- Filter Tabs (All/Pending/Today/Upcoming/Completed/Cancelled)
- View Toggle (List/Calendar)
- Booking Cards
- Calendar View

**Components Used:**
- `DashboardLayout`
- `FilterTabs`
- `BookingCard`
- `BookingDetailModal`
- `AcceptDeclineButtons`
- `CalendarView`

**User Flow:** View Bookings → Accept/Decline → Prepare → Complete

**Related Flows:** Flow 3 (Tutor)

**State Management:**
- Bookings data
- Active filter
- Selected booking
- Modal states

**API Endpoints:**
- `GET /api/bookings/tutor`
- `PUT /api/bookings/:id/accept`
- `PUT /api/bookings/:id/decline`
- `PUT /api/bookings/:id/complete`

---

### 4.3 Availability Tab (`/dashboard/tutor/availability`)

**Priority:** MVP

**Purpose:** Manage teaching schedule

**Sections:**
- Weekly Calendar Grid
- Add Availability Button
- Block Dates Button
- Legend (Available/Booked/Blocked)

**Components Used:**
- `DashboardLayout`
- `WeeklyCalendar`
- `AddAvailabilityModal`
- `BlockDatesModal`
- `TimeSlot`

**User Flow:** View Calendar → Add/Edit Slots → Block Dates

**Related Flows:** Flow 2 (Tutor)

**API Endpoints:**
- `GET /api/availability/tutor/:tutorId`
- `POST /api/availability`
- `PUT /api/availability/:id`
- `DELETE /api/availability/:id`
- `POST /api/availability/block`

---

### 4.4 Earnings Tab (`/dashboard/tutor/earnings`)

**Priority:** Phase 4

**Purpose:** View earnings and withdraw funds

**Sections:**
- Earnings Overview Cards
  - Total earnings
  - Available balance
  - Pending (in escrow)
  - This month
- Earnings Chart (last 6 months)
- Transaction History Table
- Withdraw Button

**Components Used:**
- `DashboardLayout`
- `EarningsCard`
- `EarningsChart`
- `TransactionTable`
- `WithdrawModal`

**User Flow:** View Earnings → Withdraw

**Related Flows:** Flow 6 (Tutor)

**API Endpoints:**
- `GET /api/earnings/tutor/:tutorId`
- `GET /api/transactions/tutor/:tutorId`
- `POST /api/withdrawals`

---

### 4.5 Messages Tab (`/dashboard/tutor/messages`)

**Priority:** Phase 2

**Purpose:** Chat with students

**Layout:** Same as Student Messages

**Components Used:**
- `DashboardLayout`
- `ConversationList`
- `ChatWindow`
- `MessageBubble`
- `MessageInput`
- `QuickReplyButtons`

**User Flow:** Select Conversation → Chat → Quick Reply

**Related Flows:** Flow 4 (Tutor)

---

### 4.6 Profile Tab (`/dashboard/tutor/profile`)

**Priority:** MVP

**Purpose:** Manage tutor profile

**Sections:**
1. Profile Information
   - Photo
   - Headline
   - Bio
   - Education
   - Experience
   - Teaching style
   - Languages
   - Intro video
2. Subjects & Pricing
   - List of subjects
   - Levels per subject
   - Hourly rate
   - Add/Edit/Remove
3. Account Settings
   - Change password
   - Notifications
4. Payment Settings
   - Bank account
   - E-wallet
   - NPWP

**Components Used:**
- `DashboardLayout`
- `ProfileForm`
- `SubjectForm`
- `VideoUpload`
- `PaymentMethodForm`

**API Endpoints:**
- `GET /api/tutors/me`
- `PUT /api/tutors/me`
- `GET /api/tutor-subjects`
- `POST /api/tutor-subjects`
- `PUT /api/tutor-subjects/:id`
- `DELETE /api/tutor-subjects/:id`

---

### 4.7 Verification Tab (`/dashboard/tutor/verification`)

**Priority:** MVP

**Purpose:** Upload and track verification documents

**Sections:**
- Verification Status Badge
- Required Documents
  - KTP (upload)
  - Education Certificate (upload)
- Optional Documents
  - Teaching Certificate (upload)
  - Portfolio (upload)
- Document Status (Pending/Approved/Rejected)
- Admin Notes (if rejected)

**Components Used:**
- `DashboardLayout`
- `StatusBadge`
- `FileUpload`
- `DocumentCard`

**User Flow:** Upload Docs → Wait for Review → Approved/Rejected

**Related Flows:** Flow 1 (Tutor)

**API Endpoints:**
- `GET /api/tutor-documents`
- `POST /api/tutor-documents`
- `DELETE /api/tutor-documents/:id`

---

### 4.8 Reviews Tab (`/dashboard/tutor/reviews`)

**Priority:** Phase 4

**Purpose:** View and respond to reviews

**Sections:**
- Rating Overview
- Reviews List
- Filter (All/Responded/Not Responded)
- Respond to Review

**Components Used:**
- `DashboardLayout`
- `RatingOverview`
- `ReviewCard`
- `RespondModal`

**API Endpoints:**
- `GET /api/reviews/tutor/:tutorId`
- `POST /api/reviews/:id/respond`

---

## 5. Admin Panel

### 5.1 Dashboard (`/admin`)

**Priority:** Phase 3

**Purpose:** Admin overview

**Sections:**
- Stats Cards
  - Total users
  - Total tutors
  - Total bookings today
  - Total revenue today
  - Pending verifications
  - Active disputes
- Charts
  - Revenue chart
  - Bookings chart
  - User growth chart
- Recent Activity

**Components Used:**
- `AdminLayout`
- `StatsCard`
- `Chart`
- `ActivityLog`

**API Endpoints:**
- `GET /api/admin/stats`
- `GET /api/admin/activity`

---

### 5.2 Users Page (`/admin/users`)

**Priority:** Phase 3

**Purpose:** Manage all users

**Sections:**
- Filter Bar (Role, Status, Date)
- Search Bar
- Users Table
- Actions (View, Edit, Suspend, Delete)

**Components Used:**
- `AdminLayout`
- `DataTable`
- `FilterBar`
- `ActionMenu`

**API Endpoints:**
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

---

### 5.3 Tutors Page (`/admin/tutors`)

**Priority:** Phase 3

**Purpose:** Manage tutors

**Sections:**
- Filter Bar (Status, Verification, Subject)
- Search Bar
- Tutors Table
- Actions (View, Verify, Suspend, Ban)

**Components Used:**
- `AdminLayout`
- `DataTable`
- `FilterBar`
- `ActionMenu`

**API Endpoints:**
- `GET /api/admin/tutors`
- `PUT /api/admin/tutors/:id`

---

### 5.4 Verification Queue (`/admin/verification`)

**Priority:** Phase 3

**Purpose:** Review and verify tutors

**Sections:**
- Pending Verifications List
- Tutor Card (with documents)
- Document Viewer
- Verification Checklist
- Approve/Reject Actions

**Components Used:**
- `AdminLayout`
- `VerificationCard`
- `DocumentViewer`
- `Checklist`
- `ApproveRejectButtons`

**User Flow:** Select Tutor → Review Docs → Approve/Reject

**Related Flows:** Flow 1 (Admin)

**API Endpoints:**
- `GET /api/admin/verifications/pending`
- `GET /api/admin/tutors/:id/documents`
- `POST /api/admin/tutors/:id/approve`
- `POST /api/admin/tutors/:id/reject`

---

### 5.5 Bookings Page (`/admin/bookings`)

**Priority:** Phase 3

**Purpose:** Monitor all bookings

**Sections:**
- Filter Bar (Status, Date, Subject)
- Search Bar
- Bookings Table
- Actions (View, Resolve Dispute, Refund, Cancel)

**Components Used:**
- `AdminLayout`
- `DataTable`
- `FilterBar`
- `ActionMenu`
- `DisputeModal`

**User Flow:** View Bookings → Resolve Disputes

**Related Flows:** Flow 2 (Admin)

**API Endpoints:**
- `GET /api/admin/bookings`
- `GET /api/admin/bookings/:id`
- `POST /api/admin/bookings/:id/resolve`
- `POST /api/admin/bookings/:id/refund`

---

### 5.6 Moderation Page (`/admin/moderation`)

**Priority:** Phase 3

**Purpose:** Moderate reported content

**Sections:**
- Tabs (Reviews/Messages/Profiles/All)
- Reports Queue
- Report Card (with context)
- Actions (Keep/Hide/Delete/Warn/Ban)

**Components Used:**
- `AdminLayout`
- `Tabs`
- `ReportCard`
- `ModerationActions`

**User Flow:** View Reports → Take Action

**Related Flows:** Flow 3 (Admin)

**API Endpoints:**
- `GET /api/admin/reports`
- `POST /api/admin/reports/:id/resolve`

---

## 6. Modals

### 6.1 Booking Modal

**Priority:** MVP

**Trigger:** "Pesan Sekarang" button on tutor profile

**Steps:**
1. Select Date & Time
2. Lesson Details
3. Review & Confirm

**Components Used:**
- `Modal`
- `DatePicker`
- `TimePicker`
- `DurationSelector`
- `SubjectDropdown`
- `LevelDropdown`
- `LocationInput`
- `BookingSummary`

**Related Flows:** Flow 3, Flow 4 (Student)

---

### 6.2 Payment Modal

**Priority:** MVP

**Trigger:** After booking confirmation

**Sections:**
- Booking Summary
- Payment Methods
- Payment Instructions

**Components Used:**
- `Modal`
- `PaymentMethodSelector`
- `PaymentInstructions`

**Related Flows:** Flow 5 (Student)

---

### 6.3 Login/Register Modal

**Priority:** MVP

**Trigger:** Unauthenticated user tries to book/chat/favorite

**Tabs:**
- Login
- Register

**Components Used:**
- `Modal`
- `Tabs`
- `LoginForm`
- `RegisterForm`

---

### 6.4 Review Modal

**Priority:** Phase 4

**Trigger:** "Review" button on completed booking

**Form Fields:**
- Rating (1-5 stars)
- Comment (optional)

**Components Used:**
- `Modal`
- `StarRating`
- `Textarea`

**Related Flows:** Flow 8 (Student)

---

### 6.5 Progress Log Modal

**Priority:** Phase 4

**Trigger:** "Add Progress Log" button after lesson

**Form Fields:**
- Topics Covered
- Understanding Level (1-5 stars)
- Homework
- Notes
- Attachments

**Components Used:**
- `Modal`
- `TagInput`
- `StarRating`
- `Textarea`
- `FileUpload`

**Related Flows:** Flow 5 (Tutor)

---

## 7. Layouts

### 7.1 Public Layout

**Used By:** Homepage, Search, Tutor Profile, How It Works, Pricing

**Structure:**
```
┌─────────────────────────────┐
│ Navbar                      │
├─────────────────────────────┤
│                             │
│ Page Content                │
│                             │
├─────────────────────────────┤
│ Footer                      │
└─────────────────────────────┘
```

**Components:**
- `Navbar`
  - Logo
  - Search bar
  - Navigation links
  - Login/Register buttons (if not logged in)
  - User menu (if logged in)
- `Footer`
  - Links (About, Contact, FAQ, Terms, Privacy)
  - Social media icons
  - Copyright

---

### 7.2 Dashboard Layout

**Used By:** All dashboard pages (Student, Tutor, Admin)

**Structure:**
```
┌─────────────────────────────┐
│ Top Navbar                  │
├─────┬───────────────────────┤
│     │                       │
│ S   │ Page Content          │
│ i   │                       │
│ d   │                       │
│ e   │                       │
│ b   │                       │
│ a   │                       │
│ r   │                       │
│     │                       │
└─────┴───────────────────────┘
```

**Components:**
- `TopNavbar`
  - Logo
  - Search bar (optional)
  - Notifications icon
  - User menu
- `Sidebar`
  - Navigation links (based on role)
  - Active state
  - Collapsible (mobile)

---

## 8. Reusable Components

### 8.1 TutorCard

**Priority:** MVP

**Used In:** Homepage, Search Results, Favorites

**Props:**
- `tutor` (object)
- `onFavorite` (function)
- `onClick` (function)

**Structure:**
```
┌─────────────────────────────┐
│ [Photo]  Name               │
│          ★★★★★ 4.8 (127)    │
│                             │
│ Subjects: Math, Physics     │
│ Level: SMP, SMA             │
│                             │
│ 💻 Online | 📍 Jakarta      │
│                             │
│ Rp 150,000/jam              │
│                             │
│ ✓ Verified                  │
│                             │
│ [View Profile] [♡]          │
└─────────────────────────────┘
```

---

### 8.2 SearchBar

**Priority:** MVP

**Used In:** Homepage, Navbar, Search Results

**Props:**
- `onSearch` (function)
- `placeholder` (string)
- `defaultValue` (string)

**Features:**
- Auto-complete
- Suggestions dropdown
- Clear button
- Search icon

---

### 8.3 FilterSidebar

**Priority:** MVP

**Used In:** Search Results

**Props:**
- `filters` (object)
- `onChange` (function)
- `onReset` (function)

**Filters:**
- Subject (checkboxes)
- Level (checkboxes)
- Price Range (slider)
- Location (dropdown)
- Teaching Mode (radio)
- Rating (slider)
- Availability (date picker)

---

### 8.4 BookingCard

**Priority:** MVP

**Used In:** Student Dashboard, Tutor Dashboard

**Props:**
- `booking` (object)
- `role` (student/tutor)
- `onAction` (function)

**Structure:**
```
┌─────────────────────────────┐
│ [Tutor/Student Photo] Name  │
│                    ★★★★★    │
│                             │
│ 📅 Mon, 15 Jan 2024         │
│ 🕐 19:00 - 20:30 WIB        │
│ 📚 Matematika (SMA)         │
│ 💻 Online                   │
│                             │
│ Status: [Confirmed]         │
│                             │
│ [View] [Chat] [Cancel]      │
└─────────────────────────────┘
```

---

### 8.5 AvailabilityCalendar

**Priority:** MVP

**Used In:** Tutor Profile, Booking Modal

**Props:**
- `availability` (array)
- `bookedSlots` (array)
- `onSelectSlot` (function)

**Features:**
- Weekly view
- Color-coded slots (available/booked/blocked)
- Click to select
- Timezone display

---

### 8.6 ChatWindow

**Priority:** Phase 2

**Used In:** Messages Page

**Props:**
- `conversationId` (string)
- `messages` (array)
- `onSendMessage` (function)

**Structure:**
```
┌─────────────────────────────┐
│ [Photo] Tutor Name    [●]   │
│ Online                      │
├─────────────────────────────┤
│                             │
│ Message History             │
│ (scrollable)                │
│                             │
│ [Sent bubble]               │
│         [Received bubble]   │
│ [Sent bubble]               │
│                             │
├─────────────────────────────┤
│ [📎] [Type message...] [➤]  │
└─────────────────────────────┘
```

---

### 8.7 ReviewCard

**Priority:** Phase 4

**Used In:** Tutor Profile, Reviews Tab

**Props:**
- `review` (object)
- `showResponse` (boolean)

**Structure:**
```
┌─────────────────────────────┐
│ [Photo] Student Name        │
│         ★★★★★               │
│         15 Jan 2024         │
│                             │
│ "Great tutor! Very patient  │
│ and explains well..."       │
│                             │
│ Tutor Response:             │
│ "Thank you for the review!" │
└─────────────────────────────┘
```

---

### 8.8 RatingBreakdown

**Priority:** Phase 4

**Used In:** Tutor Profile

**Props:**
- `ratings` (object)

**Structure:**
```
┌─────────────────────────────┐
│ 5★ ████████████████ 85 (67%)│
│ 4★ ████████░░░░░░░░ 30 (24%)│
│ 3★ ██░░░░░░░░░░░░░░ 10 (8%) │
│ 2★ ░░░░░░░░░░░░░░░░  1 (1%) │
│ 1★ ░░░░░░░░░░░░░░░░  1 (0%) │
└─────────────────────────────┘
```

---

### 8.9 StatsCard

**Priority:** MVP

**Used In:** All Dashboards

**Props:**
- `title` (string)
- `value` (string/number)
- `icon` (component)
- `trend` (string, optional)

**Structure:**
```
┌─────────────────────────────┐
│ [Icon]  Total Earnings      │
│                             │
│ Rp 5,450,000                │
│                             │
│ ↑ +25% from last month      │
└─────────────────────────────┘
```

---

### 8.10 DataTable

**Priority:** Phase 3

**Used In:** Admin Panel

**Props:**
- `columns` (array)
- `data` (array)
- `onSort` (function)
- `onFilter` (function)
- `onAction` (function)

**Features:**
- Sortable columns
- Filterable
- Pagination
- Row actions
- Bulk actions

---

### 8.11 FileUpload

**Priority:** MVP

**Used In:** Register Tutor, Verification, Progress Log

**Props:**
- `accept` (string)
- `maxSize` (number)
- `multiple` (boolean)
- `onUpload` (function)

**Features:**
- Drag & drop
- File preview
- Progress bar
- Error handling
- File type validation

---

### 8.12 Notification

**Priority:** Phase 2

**Used In:** All Pages

**Props:**
- `type` (success/error/warning/info)
- `message` (string)
- `duration` (number)

**Types:**
- Toast (bottom-right)
- Banner (top)
- Inline (within component)

---

### 8.13 Modal

**Priority:** MVP

**Used In:** All Modals

**Props:**
- `isOpen` (boolean)
- `onClose` (function)
- `title` (string)
- `size` (sm/md/lg/xl)
- `children` (component)

**Features:**
- Backdrop click to close
- ESC key to close
- Scroll lock
- Responsive

---

### 8.14 Pagination

**Priority:** MVP

**Used In:** Search Results, Tables

**Props:**
- `currentPage` (number)
- `totalPages` (number)
- `onPageChange` (function)

**Structure:**
```
[< Previous] [1] [2] [3] ... [10] [Next >]
```

---

### 8.15 EmptyState

**Priority:** MVP

**Used In:** All Lists

**Props:**
- `icon` (component)
- `title` (string)
- `description` (string)
- `action` (component, optional)

**Structure:**
```
┌─────────────────────────────┐
│                             │
│         [Icon]              │
│                             │
│ No bookings yet             │
│                             │
│ Start searching for tutors  │
│                             │
│ [Search Tutors]             │
│                             │
└─────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── PublicLayout
│   ├── Navbar
│   │   ├── Logo
│   │   ├── SearchBar
│   │   ├── NavLinks
│   │   └── UserMenu
│   ├── PageContent
│   │   ├── Homepage
│   │   │   ├── Hero
│   │   │   ├── SearchBar
│   │   │   ├── CategoryGrid
│   │   │   │   └── CategoryCard
│   │   │   ├── FeaturedTutors
│   │   │   │   └── TutorCard
│   │   │   ├── HowItWorks
│   │   │   ├── Testimonials
│   │   │   │   └── TestimonialCard
│   │   │   └── CTA
│   │   ├── SearchResults
│   │   │   ├── SearchBar
│   │   │   ├── FilterSidebar
│   │   │   ├── ResultsHeader
│   │   │   │   └── SortDropdown
│   │   │   ├── TutorGrid
│   │   │   │   └── TutorCard
│   │   │   └── Pagination
│   │   └── TutorProfile
│   │       ├── TutorHeader
│   │       ├── ActionButtons
│   │       ├── AboutSection
│   │       ├── SubjectsTable
│   │       ├── AvailabilityCalendar
│   │       ├── ReviewsSection
│   │       │   ├── RatingBreakdown
│   │       │   └── ReviewCard
│   │       └── StatsSection
│   └── Footer
├── AuthLayout
│   ├── LoginPage
│   │   └── LoginForm
│   ├── RegisterStudentPage
│   │   └── RegisterForm
│   └── RegisterTutorPage
│       └── MultiStepForm
├── DashboardLayout
│   ├── TopNavbar
│   │   ├── Logo
│   │   ├── NotificationIcon
│   │   └── UserMenu
│   ├── Sidebar
│   │   └── NavLinks
│   └── PageContent
│       ├── StudentDashboard
│       │   ├── OverviewTab
│       │   │   ├── WelcomeHeader
│       │   │   ├── UpcomingLessons
│       │   │   │   └── LessonCard
│       │   │   ├── StatsGrid
│       │   │   │   └── StatsCard
│       │   │   └── NotificationList
│       │   ├── BookingsTab
│       │   │   ├── FilterBar
│       │   │   ├── BookingList
│       │   │   │   └── BookingCard
│       │   │   └── Pagination
│       │   ├── ProgressTab
│       │   │   ├── ProgressCard
│       │   │   └── ProgressTimeline
│       │   ├── MessagesTab
│       │   │   ├── ConversationList
│       │   │   └── ChatWindow
│       │   ├── FavoritesTab
│       │   │   └── TutorCard
│       │   └── ProfileTab
│       │       └── ProfileForm
│       ├── TutorDashboard
│       │   ├── OverviewTab
│       │   ├── BookingsTab
│       │   ├── AvailabilityTab
│       │   │   ├── WeeklyCalendar
│       │   │   └── AddAvailabilityModal
│       │   ├── EarningsTab
│       │   │   ├── EarningsCard
│       │   │   ├── EarningsChart
│       │   │   ├── TransactionTable
│       │   │   └── WithdrawModal
│       │   ├── MessagesTab
│       │   ├── ProfileTab
│       │   ├── VerificationTab
│       │   │   ├── DocumentCard
│       │   │   └── FileUpload
│       │   └── ReviewsTab
│       └── AdminPanel
│           ├── DashboardTab
│           ├── UsersTab
│           ├── TutorsTab
│           ├── VerificationTab
│           ├── BookingsTab
│           └── ModerationTab
└── Modals
    ├── BookingModal
    ├── PaymentModal
    ├── LoginRegisterModal
    ├── ReviewModal
    └── ProgressLogModal
```

---

## Design System

### Colors

**Primary (Sky Blue):**
- `primary-50`: #f0f9ff
- `primary-100`: #e0f2fe
- `primary-200`: #bae6fd
- `primary-300`: #7dd3fc
- `primary-400`: #38bdf8
- `primary-500`: #0ea5e9 (main)
- `primary-600`: #0284c7
- `primary-700`: #0369a1
- `primary-800`: #075985
- `primary-900`: #0c4a6e

**Secondary (Orange):**
- `secondary-500`: #f97316

**Neutral:**
- `gray-50` to `gray-900`

**Semantic:**
- `success`: #10b981
- `warning`: #f59e0b
- `error`: #ef4444
- `info`: #3b82f6

### Typography

**Font Family:**
- Headings: Inter Bold / Poppins Bold
- Body: Inter Regular / Open Sans Regular

**Font Sizes:**
- `text-xs`: 12px
- `text-sm`: 14px
- `text-base`: 16px
- `text-lg`: 18px
- `text-xl`: 20px
- `text-2xl`: 24px
- `text-3xl`: 30px
- `text-4xl`: 36px

### Spacing

Using Tailwind's default spacing scale (4px increments)

### Border Radius

- `rounded-sm`: 2px
- `rounded`: 4px
- `rounded-md`: 6px
- `rounded-lg`: 8px
- `rounded-xl`: 12px
- `rounded-2xl`: 16px
- `rounded-full`: 9999px

### Shadows

- `shadow-sm`: Small shadow
- `shadow`: Default shadow
- `shadow-md`: Medium shadow
- `shadow-lg`: Large shadow
- `shadow-xl`: Extra large shadow

---

## Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Mobile-First Approach:**
- Design for mobile first
- Progressive enhancement for larger screens
- Hamburger menu on mobile
- Collapsible sidebar on tablet

---

## Accessibility

**Requirements:**
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Focus indicators
- Alt text for images
- ARIA labels
- Color contrast ratio > 4.5:1

---

## Performance

**Targets:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

**Optimization Strategies:**
- Code splitting
- Lazy loading
- Image optimization
- CDN for static assets
- Caching (Redis)
- Minification
- Tree shaking

---

## Summary

Total Components: **50+**
- Pages: 24
- Modals: 5
- Layouts: 2
- Reusable Components: 15+

**Priority Breakdown:**
- **MVP:** 30 components
- **Phase 1:** 5 components
- **Phase 2:** 8 components
- **Phase 3:** 10 components
- **Phase 4:** 7 components

**Ready for:**
- Frontend development
- Component library setup (Storybook)
- Design system implementation
- UI testing
