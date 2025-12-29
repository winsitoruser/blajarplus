# Development Task Tracker - Blajarplus

## Overview

Comprehensive task breakdown untuk 17 minggu development cycle (4 phases, 9 sprints).

---

## Phase 1: Foundation (Sprint 1-2) - 4 Minggu

### Sprint 1: Design & Setup (Week 1-2)

#### UI/UX Design Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| D1.1 | Design System Setup (Colors, Typography, Components) | High | 16h | - | Pending |
| D1.2 | Homepage Wireframe & Design | High | 12h | D1.1 | Pending |
| D1.3 | Search Results Page Design | High | 10h | D1.1 | Pending |
| D1.4 | Tutor Profile Page Design | High | 12h | D1.1 | Pending |
| D1.5 | Booking Flow Design (Modal/Page) | High | 14h | D1.1 | Pending |
| D1.6 | Payment Page Design | High | 10h | D1.1 | Pending |
| D1.7 | Student Dashboard Design | High | 16h | D1.1 | Pending |
| D1.8 | Tutor Dashboard Design | High | 16h | D1.1 | Pending |
| D1.9 | Mobile Responsive Design | High | 12h | D1.2-D1.8 | Pending |
| D1.10 | Design Handoff & Documentation | Medium | 8h | D1.1-D1.9 | Pending |

**Total Sprint 1 Design:** 126 hours (~3 weeks for 1 designer)

#### Backend Setup Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| B1.1 | Project Setup (NestJS/Express) | High | 4h | - | Pending |
| B1.2 | Database Setup (PostgreSQL) | High | 4h | - | Pending |
| B1.3 | Database Migration Tool Setup (Prisma/TypeORM) | High | 6h | B1.2 | Pending |
| B1.4 | Environment Configuration | High | 3h | B1.1 | Pending |
| B1.5 | API Documentation Setup (Swagger) | Medium | 4h | B1.1 | Pending |
| B1.6 | Error Handling & Logging | High | 6h | B1.1 | Pending |
| B1.7 | CORS & Security Setup | High | 4h | B1.1 | Pending |

**Total Sprint 1 Backend Setup:** 31 hours

#### Frontend Setup Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| F1.1 | Project Setup (Next.js/React) | High | 4h | - | Pending |
| F1.2 | TailwindCSS Configuration | High | 3h | F1.1 | Pending |
| F1.3 | shadcn/ui Setup | High | 4h | F1.2 | Pending |
| F1.4 | Routing Setup | High | 4h | F1.1 | Pending |
| F1.5 | State Management Setup (Zustand/Redux) | High | 6h | F1.1 | Pending |
| F1.6 | API Client Setup (Axios/Fetch) | High | 4h | F1.1 | Pending |
| F1.7 | Environment Configuration | High | 2h | F1.1 | Pending |

**Total Sprint 1 Frontend Setup:** 27 hours

---

### Sprint 2: Core Tables & Auth (Week 3-4)

#### Database Migration Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| DB2.1 | Create `users` table migration | High | 3h | B1.3 | Pending |
| DB2.2 | Create `user_addresses` table migration | Medium | 2h | DB2.1 | Pending |
| DB2.3 | Create `tutor_profiles` table migration | High | 4h | DB2.1 | Pending |
| DB2.4 | Create `subject_categories` table migration | High | 2h | - | Pending |
| DB2.5 | Create `subjects` table migration | High | 3h | DB2.4 | Pending |
| DB2.6 | Create `tutor_subjects` pivot table migration | High | 3h | DB2.3, DB2.5 | Pending |
| DB2.7 | Create `tutor_availabilities` table migration | High | 3h | DB2.3 | Pending |
| DB2.8 | Create `tutor_documents` table migration | High | 3h | DB2.3 | Pending |
| DB2.9 | Seed subject categories & subjects | High | 4h | DB2.4, DB2.5 | Pending |
| DB2.10 | Create indexes for performance | Medium | 4h | DB2.1-DB2.8 | Pending |

**Total Sprint 2 Database:** 31 hours

#### Authentication Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BA2.1 | JWT Authentication Setup | High | 8h | B1.1, DB2.1 | Pending |
| BA2.2 | User Registration API (Student) | High | 8h | BA2.1 | Pending |
| BA2.3 | User Registration API (Tutor) | High | 10h | BA2.1 | Pending |
| BA2.4 | Login API | High | 6h | BA2.1 | Pending |
| BA2.5 | Google OAuth Integration | Medium | 12h | BA2.1 | Pending |
| BA2.6 | Password Reset Flow | Medium | 8h | BA2.1 | Pending |
| BA2.7 | Email Verification | Medium | 8h | BA2.1 | Pending |
| BA2.8 | Role-Based Access Control (RBAC) | High | 10h | BA2.1 | Pending |
| BA2.9 | Session Management | High | 6h | BA2.1 | Pending |

**Total Sprint 2 Auth Backend:** 76 hours

#### Authentication Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FA2.1 | Login Page UI | High | 8h | D1.1, F1.1 | Pending |
| FA2.2 | Register Student Page UI | High | 10h | D1.1, F1.1 | Pending |
| FA2.3 | Register Tutor Page UI (Multi-step) | High | 16h | D1.1, F1.1 | Pending |
| FA2.4 | Auth Context/Store Setup | High | 6h | F1.5 | Pending |
| FA2.5 | Login API Integration | High | 6h | FA2.1, BA2.4 | Pending |
| FA2.6 | Register API Integration | High | 8h | FA2.2, FA2.3, BA2.2, BA2.3 | Pending |
| FA2.7 | Google OAuth Button Integration | Medium | 6h | BA2.5 | Pending |
| FA2.8 | Protected Route HOC | High | 4h | FA2.4 | Pending |
| FA2.9 | Password Reset Flow UI | Medium | 8h | BA2.6 | Pending |
| FA2.10 | Form Validation | High | 6h | FA2.1-FA2.3 | Pending |

**Total Sprint 2 Auth Frontend:** 78 hours

---

## Phase 2: Core System (Sprint 3-4) - 4 Minggu

### Sprint 3: Search, Profile & Booking (Week 5-6)

#### Search & Filter Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BS3.1 | Tutor Search API (with filters) | High | 16h | DB2.3-DB2.6 | Pending |
| BS3.2 | Full-text Search Implementation | High | 12h | BS3.1 | Pending |
| BS3.3 | Filter Logic (Subject, Level, Price, Location, Rating) | High | 12h | BS3.1 | Pending |
| BS3.4 | Sort Logic (Relevance, Rating, Price, Experience) | High | 8h | BS3.1 | Pending |
| BS3.5 | Pagination Implementation | High | 4h | BS3.1 | Pending |
| BS3.6 | Tutor Profile API (GET by ID) | High | 8h | DB2.3 | Pending |
| BS3.7 | Tutor Availability API | High | 8h | DB2.7 | Pending |
| BS3.8 | Search Performance Optimization (Caching) | Medium | 8h | BS3.1 | Pending |

**Total Sprint 3 Search Backend:** 76 hours

#### Search & Profile Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FS3.1 | Homepage UI Implementation | High | 16h | D1.2, F1.1 | Pending |
| FS3.2 | Search Bar Component | High | 8h | FS3.1 | Pending |
| FS3.3 | Search Results Page UI | High | 16h | D1.3, F1.1 | Pending |
| FS3.4 | Filter Sidebar Component | High | 12h | FS3.3 | Pending |
| FS3.5 | Tutor Card Component | High | 8h | FS3.3 | Pending |
| FS3.6 | Sort Dropdown Component | High | 4h | FS3.3 | Pending |
| FS3.7 | Pagination Component | High | 4h | FS3.3 | Pending |
| FS3.8 | Search API Integration | High | 12h | FS3.3, BS3.1 | Pending |
| FS3.9 | Filter API Integration | High | 10h | FS3.4, BS3.3 | Pending |
| FS3.10 | Tutor Profile Page UI | High | 20h | D1.4, F1.1 | Pending |
| FS3.11 | Availability Calendar Component | High | 12h | FS3.10 | Pending |
| FS3.12 | Reviews Section Component | High | 10h | FS3.10 | Pending |
| FS3.13 | Profile API Integration | High | 8h | FS3.10, BS3.6 | Pending |

**Total Sprint 3 Search Frontend:** 140 hours

#### Booking Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BB3.1 | Create `bookings` table migration | High | 4h | DB2.1, DB2.3 | Pending |
| BB3.2 | Create `booking_status_logs` table migration | Medium | 3h | BB3.1 | Pending |
| BB3.3 | Create Booking API | High | 12h | BB3.1 | Pending |
| BB3.4 | Get Booking by ID API | High | 4h | BB3.1 | Pending |
| BB3.5 | List Bookings API (with filters) | High | 8h | BB3.1 | Pending |
| BB3.6 | Update Booking Status API | High | 6h | BB3.1 | Pending |
| BB3.7 | Cancel Booking API (with refund logic) | High | 10h | BB3.1 | Pending |
| BB3.8 | Booking Validation (slot availability) | High | 8h | BB3.3 | Pending |
| BB3.9 | Booking Conflict Prevention | High | 6h | BB3.3 | Pending |

**Total Sprint 3 Booking Backend:** 61 hours

#### Booking Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FB3.1 | Booking Modal Component | High | 16h | D1.5, F1.1 | Pending |
| FB3.2 | Date & Time Picker Component | High | 12h | FB3.1 | Pending |
| FB3.3 | Lesson Details Form | High | 10h | FB3.1 | Pending |
| FB3.4 | Booking Summary Component | High | 8h | FB3.1 | Pending |
| FB3.5 | Booking API Integration | High | 12h | FB3.1, BB3.3 | Pending |
| FB3.6 | Booking Validation (Frontend) | High | 6h | FB3.1 | Pending |

**Total Sprint 3 Booking Frontend:** 64 hours

---

### Sprint 4: Chat & Dashboard (Week 7-8)

#### Chat Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BC4.1 | Create `conversations` table migration | High | 3h | DB2.1, DB2.3 | Pending |
| BC4.2 | Create `messages` table migration | High | 3h | BC4.1 | Pending |
| BC4.3 | WebSocket Setup (Socket.io) | High | 12h | B1.1 | Pending |
| BC4.4 | Create Conversation API | High | 8h | BC4.1 | Pending |
| BC4.5 | Send Message API | High | 8h | BC4.2 | Pending |
| BC4.6 | Get Messages API (with pagination) | High | 8h | BC4.2 | Pending |
| BC4.7 | Mark Message as Read API | High | 4h | BC4.2 | Pending |
| BC4.8 | Real-time Message Delivery (WebSocket) | High | 16h | BC4.3, BC4.5 | Pending |
| BC4.9 | File Upload for Chat (Images, PDFs) | Medium | 10h | BC4.5 | Pending |
| BC4.10 | Chat Notifications | Medium | 8h | BC4.5 | Pending |

**Total Sprint 4 Chat Backend:** 80 hours

#### Chat Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FC4.1 | Chat Page Layout | High | 12h | F1.1 | Pending |
| FC4.2 | Conversation List Component | High | 10h | FC4.1 | Pending |
| FC4.3 | Chat Window Component | High | 12h | FC4.1 | Pending |
| FC4.4 | Message Bubble Component | High | 8h | FC4.3 | Pending |
| FC4.5 | Message Input Component | High | 8h | FC4.3 | Pending |
| FC4.6 | WebSocket Client Setup | High | 10h | BC4.3 | Pending |
| FC4.7 | Send Message Integration | High | 8h | FC4.5, BC4.5 | Pending |
| FC4.8 | Receive Message Integration (Real-time) | High | 10h | FC4.3, BC4.8 | Pending |
| FC4.9 | File Upload Component | Medium | 8h | BC4.9 | Pending |
| FC4.10 | Unread Badge & Notifications | Medium | 6h | BC4.10 | Pending |

**Total Sprint 4 Chat Frontend:** 92 hours

#### Dashboard Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BD4.1 | Student Dashboard Stats API | High | 8h | BB3.1 | Pending |
| BD4.2 | Tutor Dashboard Stats API | High | 8h | BB3.1 | Pending |
| BD4.3 | User Profile API (GET) | High | 4h | DB2.1 | Pending |
| BD4.4 | Update User Profile API | High | 8h | DB2.1 | Pending |
| BD4.5 | Upload Profile Picture API | High | 8h | BD4.4 | Pending |
| BD4.6 | Favorites API (Add/Remove/List) | Medium | 8h | DB2.1, DB2.3 | Pending |

**Total Sprint 4 Dashboard Backend:** 44 hours

#### Dashboard Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FD4.1 | Student Dashboard Layout | High | 12h | D1.7, F1.1 | Pending |
| FD4.2 | Overview Tab Component | High | 10h | FD4.1 | Pending |
| FD4.3 | Bookings Tab Component | High | 16h | FD4.1 | Pending |
| FD4.4 | Booking Card Component | High | 8h | FD4.3 | Pending |
| FD4.5 | Booking Detail Modal | High | 10h | FD4.3 | Pending |
| FD4.6 | Cancel Booking Modal | High | 8h | FD4.3 | Pending |
| FD4.7 | Profile Tab Component | High | 12h | FD4.1 | Pending |
| FD4.8 | Tutor Dashboard Layout | High | 12h | D1.8, F1.1 | Pending |
| FD4.9 | Tutor Bookings Calendar View | High | 16h | FD4.8 | Pending |
| FD4.10 | Dashboard API Integration | High | 12h | FD4.1-FD4.9, BD4.1-BD4.2 | Pending |

**Total Sprint 4 Dashboard Frontend:** 116 hours

---

## Phase 3: Payment & Verification (Sprint 5-6) - 4 Minggu

### Sprint 5: Payment System (Week 9-10)

#### Payment Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BP5.1 | Create `payment_transactions` table migration | High | 4h | BB3.1 | Pending |
| BP5.2 | Create `wallets` table migration | High | 3h | DB2.1 | Pending |
| BP5.3 | Create `wallet_ledger_entries` table migration | High | 4h | BP5.2 | Pending |
| BP5.4 | Midtrans Integration Setup | High | 16h | B1.1 | Pending |
| BP5.5 | Create Payment Transaction API | High | 12h | BP5.1, BP5.4 | Pending |
| BP5.6 | Payment Webhook Handler (Midtrans) | High | 16h | BP5.4, BP5.5 | Pending |
| BP5.7 | Payment Status Update API | High | 8h | BP5.1 | Pending |
| BP5.8 | Escrow Hold Logic | High | 10h | BP5.2, BP5.3 | Pending |
| BP5.9 | Escrow Release Logic (on booking complete) | High | 12h | BP5.8, BB3.1 | Pending |
| BP5.10 | Refund Logic | High | 12h | BP5.1, BP5.3 | Pending |
| BP5.11 | Payment Notification Service | Medium | 8h | BP5.6 | Pending |
| BP5.12 | Xendit Integration (Alternative) | Low | 16h | BP5.4 | Pending |

**Total Sprint 5 Payment Backend:** 121 hours

#### Payment Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FP5.1 | Payment Page UI | High | 16h | D1.6, F1.1 | Pending |
| FP5.2 | Payment Method Selection Component | High | 12h | FP5.1 | Pending |
| FP5.3 | Payment Summary Component | High | 8h | FP5.1 | Pending |
| FP5.4 | Payment API Integration | High | 12h | FP5.1, BP5.5 | Pending |
| FP5.5 | Midtrans Snap Integration | High | 12h | FP5.4, BP5.4 | Pending |
| FP5.6 | Payment Success Page | High | 8h | FP5.1 | Pending |
| FP5.7 | Payment Failed Page | High | 6h | FP5.1 | Pending |
| FP5.8 | Payment Status Polling | Medium | 6h | FP5.4 | Pending |

**Total Sprint 5 Payment Frontend:** 80 hours

---

### Sprint 6: Verification & Admin (Week 11-12)

#### Verification Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BV6.1 | File Upload Service (S3/CloudStorage) | High | 12h | B1.1 | Pending |
| BV6.2 | Upload Tutor Documents API | High | 10h | DB2.8, BV6.1 | Pending |
| BV6.3 | Get Tutor Documents API | High | 4h | DB2.8 | Pending |
| BV6.4 | Update Document Status API (Admin) | High | 6h | DB2.8 | Pending |
| BV6.5 | Approve Tutor API | High | 8h | DB2.3 | Pending |
| BV6.6 | Reject Tutor API | High | 8h | DB2.3 | Pending |
| BV6.7 | Email Notification Service | High | 12h | B1.1 | Pending |
| BV6.8 | Verification Status Webhook | Medium | 6h | BV6.5, BV6.6 | Pending |

**Total Sprint 6 Verification Backend:** 66 hours

#### Admin Panel Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BA6.1 | Create `notifications` table migration | High | 3h | DB2.1 | Pending |
| BA6.2 | Create `reports` table migration | High | 3h | DB2.1 | Pending |
| BA6.3 | Admin Dashboard Stats API | High | 10h | BB3.1, BP5.1 | Pending |
| BA6.4 | List Users API (with filters) | High | 8h | DB2.1 | Pending |
| BA6.5 | List Tutors API (with filters) | High | 8h | DB2.3 | Pending |
| BA6.6 | Pending Verifications API | High | 6h | DB2.3, DB2.8 | Pending |
| BA6.7 | List Bookings API (Admin view) | High | 8h | BB3.1 | Pending |
| BA6.8 | List Payments API (Admin view) | High | 8h | BP5.1 | Pending |
| BA6.9 | Dispute Resolution API | High | 12h | BB3.1 | Pending |
| BA6.10 | Content Moderation API | Medium | 10h | BA6.2 | Pending |
| BA6.11 | Create Notification API | Medium | 6h | BA6.1 | Pending |

**Total Sprint 6 Admin Backend:** 82 hours

#### Admin Panel Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FA6.1 | Admin Layout & Navigation | High | 12h | F1.1 | Pending |
| FA6.2 | Admin Dashboard Page | High | 16h | FA6.1 | Pending |
| FA6.3 | Users Management Page | High | 16h | FA6.1 | Pending |
| FA6.4 | Tutors Management Page | High | 16h | FA6.1 | Pending |
| FA6.5 | Verification Queue Page | High | 20h | FA6.1 | Pending |
| FA6.6 | Document Viewer Component | High | 12h | FA6.5 | Pending |
| FA6.7 | Verification Actions Component | High | 10h | FA6.5 | Pending |
| FA6.8 | Bookings Management Page | High | 16h | FA6.1 | Pending |
| FA6.9 | Payments Management Page | High | 16h | FA6.1 | Pending |
| FA6.10 | Dispute Resolution Page | High | 16h | FA6.1 | Pending |
| FA6.11 | Moderation Page | Medium | 16h | FA6.1 | Pending |
| FA6.12 | Admin API Integration | High | 16h | FA6.1-FA6.11 | Pending |

**Total Sprint 6 Admin Frontend:** 182 hours

#### Tutor Profile Setup Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FT6.1 | Tutor Availability Setup Page | High | 16h | FD4.8 | Pending |
| FT6.2 | Weekly Calendar Component | High | 12h | FT6.1 | Pending |
| FT6.3 | Add Availability Modal | High | 10h | FT6.1 | Pending |
| FT6.4 | Block Dates Modal | High | 8h | FT6.1 | Pending |
| FT6.5 | Document Upload Component | High | 12h | FD4.8 | Pending |
| FT6.6 | Verification Status Page | High | 10h | FD4.8 | Pending |

**Total Sprint 6 Tutor Frontend:** 68 hours

---

## Phase 4: Enhancement (Sprint 7-9) - 5 Minggu

### Sprint 7: Progress Tracking & Reviews (Week 13-14)

#### Progress Tracking Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BPT7.1 | Create `progress_logs` table migration | High | 3h | BB3.1 | Pending |
| BPT7.2 | Create Progress Log API | High | 10h | BPT7.1 | Pending |
| BPT7.3 | Get Progress Logs API (by booking/student) | High | 8h | BPT7.1 | Pending |
| BPT7.4 | Update Progress Log API | High | 6h | BPT7.1 | Pending |
| BPT7.5 | Progress Analytics API | Medium | 10h | BPT7.1 | Pending |
| BPT7.6 | Export Progress as PDF API | Medium | 12h | BPT7.1 | Pending |

**Total Sprint 7 Progress Backend:** 49 hours

#### Reviews Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BR7.1 | Create `reviews` table migration | High | 3h | BB3.1, DB2.3 | Pending |
| BR7.2 | Create Review API | High | 10h | BR7.1 | Pending |
| BR7.3 | Get Reviews API (by tutor) | High | 6h | BR7.1 | Pending |
| BR7.4 | Update Tutor Rating (Aggregate) | High | 8h | BR7.1, DB2.3 | Pending |
| BR7.5 | Review Validation (1 booking = 1 review) | High | 6h | BR7.2 | Pending |
| BR7.6 | Tutor Response to Review API | Medium | 6h | BR7.1 | Pending |

**Total Sprint 7 Reviews Backend:** 39 hours

#### Progress & Reviews Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FPT7.1 | Progress Tab Component (Student Dashboard) | High | 12h | FD4.1 | Pending |
| FPT7.2 | Progress Card Component | High | 10h | FPT7.1 | Pending |
| FPT7.3 | Progress Timeline Component | High | 12h | FPT7.1 | Pending |
| FPT7.4 | Add Progress Log Form (Tutor) | High | 16h | FD4.8 | Pending |
| FPT7.5 | Progress Log Detail View | High | 10h | FPT7.1 | Pending |
| FPT7.6 | Review Modal Component | High | 12h | FD4.3 | Pending |
| FPT7.7 | Review Form Component | High | 10h | FPT7.6 | Pending |
| FPT7.8 | Review List Component (Tutor Profile) | High | 10h | FS3.10 | Pending |
| FPT7.9 | Progress & Review API Integration | High | 12h | FPT7.1-FPT7.8 | Pending |

**Total Sprint 7 Progress Frontend:** 104 hours

---

### Sprint 8: Earnings & Packages (Week 15-16)

#### Earnings Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BE8.1 | Tutor Earnings API | High | 10h | BP5.2, BP5.3 | Pending |
| BE8.2 | Earnings Chart Data API | High | 8h | BP5.3 | Pending |
| BE8.3 | Transaction History API | High | 8h | BP5.3 | Pending |
| BE8.4 | Withdrawal Request API | High | 12h | BP5.2 | Pending |
| BE8.5 | Process Withdrawal (to Bank/E-wallet) | High | 16h | BE8.4 | Pending |
| BE8.6 | Withdrawal Status Update API | High | 6h | BE8.4 | Pending |
| BE8.7 | Payment Method Management API | Medium | 8h | BP5.2 | Pending |

**Total Sprint 8 Earnings Backend:** 68 hours

#### Packages Backend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| BPK8.1 | Create `lesson_packages` table migration | Medium | 3h | DB2.3 | Pending |
| BPK8.2 | Create `package_purchases` table migration | Medium | 3h | BPK8.1 | Pending |
| BPK8.3 | Create Package API (Tutor) | Medium | 8h | BPK8.1 | Pending |
| BPK8.4 | List Packages API (by Tutor) | Medium | 6h | BPK8.1 | Pending |
| BPK8.5 | Purchase Package API (Student) | Medium | 10h | BPK8.2, BP5.1 | Pending |
| BPK8.6 | Use Package Session (Booking) | Medium | 8h | BPK8.2, BB3.1 | Pending |

**Total Sprint 8 Packages Backend:** 38 hours

#### Earnings & Packages Frontend Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| FE8.1 | Earnings Tab Component (Tutor Dashboard) | High | 16h | FD4.8 | Pending |
| FE8.2 | Earnings Overview Cards | High | 10h | FE8.1 | Pending |
| FE8.3 | Earnings Chart Component | High | 12h | FE8.1 | Pending |
| FE8.4 | Transaction History Table | High | 12h | FE8.1 | Pending |
| FE8.5 | Withdrawal Modal Component | High | 16h | FE8.1 | Pending |
| FE8.6 | Payment Method Management Page | Medium | 12h | FD4.8 | Pending |
| FE8.7 | Create Package Modal (Tutor) | Medium | 12h | FD4.8 | Pending |
| FE8.8 | Package Card Component | Medium | 8h | FS3.10 | Pending |
| FE8.9 | Purchase Package Flow | Medium | 12h | FE8.8 | Pending |
| FE8.10 | Earnings API Integration | High | 12h | FE8.1-FE8.6 | Pending |

**Total Sprint 8 Earnings Frontend:** 122 hours

---

### Sprint 9: Optimization & Testing (Week 17)

#### Performance Optimization Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| PO9.1 | Database Query Optimization | High | 16h | All DB tables | Pending |
| PO9.2 | Add Database Indexes | High | 8h | PO9.1 | Pending |
| PO9.3 | Redis Caching Implementation | High | 16h | B1.1 | Pending |
| PO9.4 | API Response Time Optimization | High | 12h | All APIs | Pending |
| PO9.5 | Frontend Bundle Optimization | High | 12h | F1.1 | Pending |
| PO9.6 | Image Optimization & CDN Setup | Medium | 10h | BV6.1 | Pending |
| PO9.7 | Lazy Loading Implementation | Medium | 8h | F1.1 | Pending |
| PO9.8 | Code Splitting | Medium | 8h | F1.1 | Pending |

**Total Sprint 9 Optimization:** 90 hours

#### Security Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| SE9.1 | Security Audit | High | 16h | All APIs | Pending |
| SE9.2 | SQL Injection Prevention | High | 8h | All APIs | Pending |
| SE9.3 | XSS Prevention | High | 8h | All Frontend | Pending |
| SE9.4 | CSRF Protection | High | 6h | B1.1 | Pending |
| SE9.5 | Rate Limiting | High | 8h | B1.1 | Pending |
| SE9.6 | Input Validation & Sanitization | High | 12h | All APIs | Pending |
| SE9.7 | Sensitive Data Encryption | High | 10h | DB2.1, BP5.1 | Pending |
| SE9.8 | HTTPS & SSL Setup | High | 4h | Deployment | Pending |

**Total Sprint 9 Security:** 72 hours

#### Testing Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| TE9.1 | Unit Tests (Backend) | High | 40h | All Backend | Pending |
| TE9.2 | Integration Tests (Backend) | High | 40h | All Backend | Pending |
| TE9.3 | Unit Tests (Frontend) | High | 40h | All Frontend | Pending |
| TE9.4 | E2E Tests (Playwright/Cypress) | High | 40h | All Frontend | Pending |
| TE9.5 | API Testing (Postman/Jest) | High | 24h | All APIs | Pending |
| TE9.6 | Load Testing | Medium | 16h | All APIs | Pending |
| TE9.7 | UAT (User Acceptance Testing) | High | 40h | All Features | Pending |
| TE9.8 | Bug Fixing | High | 60h | TE9.1-TE9.7 | Pending |

**Total Sprint 9 Testing:** 300 hours

#### Documentation & Deployment Tasks

| ID | Task | Priority | Estimated Hours | Dependencies | Status |
|----|------|----------|-----------------|--------------|--------|
| DD9.1 | API Documentation (Swagger) | High | 16h | All APIs | Pending |
| DD9.2 | User Guide (Student) | Medium | 12h | All Features | Pending |
| DD9.3 | User Guide (Tutor) | Medium | 12h | All Features | Pending |
| DD9.4 | Admin Manual | Medium | 10h | Admin Panel | Pending |
| DD9.5 | Developer Documentation | Medium | 16h | All Code | Pending |
| DD9.6 | Deployment Setup (Docker) | High | 16h | B1.1, F1.1 | Pending |
| DD9.7 | CI/CD Pipeline Setup | High | 16h | DD9.6 | Pending |
| DD9.8 | Production Deployment | High | 12h | DD9.6, DD9.7 | Pending |
| DD9.9 | Monitoring & Logging Setup | High | 12h | DD9.8 | Pending |
| DD9.10 | Backup & Recovery Setup | High | 8h | DD9.8 | Pending |

**Total Sprint 9 Documentation:** 130 hours

---

## Summary by Phase

### Phase 1: Foundation (4 weeks)
- **Design:** 126 hours
- **Backend:** 107 hours
- **Frontend:** 105 hours
- **Database:** 31 hours
- **Total:** 369 hours

### Phase 2: Core System (4 weeks)
- **Backend:** 261 hours
- **Frontend:** 412 hours
- **Total:** 673 hours

### Phase 3: Payment & Verification (4 weeks)
- **Backend:** 269 hours
- **Frontend:** 330 hours
- **Total:** 599 hours

### Phase 4: Enhancement (5 weeks)
- **Backend:** 194 hours
- **Frontend:** 348 hours
- **Optimization:** 90 hours
- **Security:** 72 hours
- **Testing:** 300 hours
- **Documentation:** 130 hours
- **Total:** 1,134 hours

### Grand Total: 2,775 hours

---

## Team Allocation Estimate

Assuming 40-hour work weeks:

**Minimum Team:**
- 1 Product Manager (part-time oversight)
- 1 UI/UX Designer (full-time, 17 weeks)
- 2 Backend Developers (full-time, 17 weeks)
- 2 Frontend Developers (full-time, 17 weeks)
- 1 QA Engineer (full-time, last 5 weeks)

**Optimal Team:**
- 1 Product Manager
- 1 UI/UX Designer
- 3 Backend Developers
- 3 Frontend Developers
- 1 DevOps Engineer
- 1 QA Engineer

---

## Critical Path

1. **Week 1-2:** Design System & Setup
2. **Week 3-4:** Auth & Core Tables
3. **Week 5-6:** Search & Booking
4. **Week 7-8:** Chat & Dashboard
5. **Week 9-10:** Payment Integration
6. **Week 11-12:** Verification & Admin
7. **Week 13-14:** Progress & Reviews
8. **Week 15-16:** Earnings & Packages
9. **Week 17:** Testing & Deployment

---

## Risk Mitigation

**High-Risk Items:**
1. Payment Gateway Integration (Midtrans) - Buffer: +1 week
2. Real-time Chat (WebSocket) - Buffer: +3 days
3. Escrow System Logic - Buffer: +1 week
4. Admin Verification Flow - Buffer: +3 days

**Recommended Buffers:**
- Add 2 weeks buffer for unforeseen issues
- Total realistic timeline: **19 weeks (4.5 months)**

---

## Next Steps

1. **Assign tasks** to team members
2. **Set up project management** tool (Jira/Linear/Notion)
3. **Create sprint boards** for each sprint
4. **Daily standups** for progress tracking
5. **Weekly demos** to stakeholders
6. **Sprint retrospectives** for continuous improvement
