# Database Schema (ERD) - Blajarplus

## Overview

Database menggunakan **PostgreSQL** dengan **11 domain groups** untuk mengelola seluruh sistem marketplace tutor-murid.

**Konvensi:**
- Primary Key: `id` (UUID)
- Timestamps: `created_at`, `updated_at` (timestamptz)
- Soft delete: `deleted_at` (optional)
- Money: `numeric(12,2)` + `currency` (default IDR)
- Enums: PostgreSQL enum atau string + validation

---

## Entity Relationship Diagram

### 1. Users & Roles

#### `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20) UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  gender VARCHAR(20),
  birthdate DATE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

**Relationships:**
- 1 User → 0..1 Tutor Profile
- 1 User → Many Bookings (as student)
- 1 User → Many Messages
- 1 User → Many Reviews
- 1 User → Many Favorites
- 1 User → Many Addresses

---

#### `user_addresses`
```sql
CREATE TABLE user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),
  province VARCHAR(100),
  city VARCHAR(100),
  district VARCHAR(100),
  address_detail TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_addresses_city ON user_addresses(city);
```

**Relationships:**
- Many Addresses → 1 User

---

### 2. Tutor Domain

#### `tutor_profiles`
```sql
CREATE TABLE tutor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  headline VARCHAR(255),
  bio TEXT,
  education TEXT,
  experience_years INTEGER,
  teaching_modes VARCHAR(20)[] CHECK (teaching_modes <@ ARRAY['online', 'offline', 'both']),
  base_city VARCHAR(100),
  timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
  intro_video_url TEXT,
  hourly_rate NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_status VARCHAR(20) DEFAULT 'none' CHECK (verification_status IN ('none', 'pending', 'approved', 'rejected')),
  verification_note TEXT,
  rating_avg NUMERIC(2,1) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  completed_lessons_count INTEGER DEFAULT 0,
  response_rate INTEGER DEFAULT 0 CHECK (response_rate BETWEEN 0 AND 100),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive', 'banned')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tutor_profiles_user_id ON tutor_profiles(user_id);
CREATE INDEX idx_tutor_profiles_base_city ON tutor_profiles(base_city);
CREATE INDEX idx_tutor_profiles_hourly_rate ON tutor_profiles(hourly_rate);
CREATE INDEX idx_tutor_profiles_rating_avg ON tutor_profiles(rating_avg DESC);
CREATE INDEX idx_tutor_profiles_verification_status ON tutor_profiles(verification_status);
CREATE INDEX idx_tutor_profiles_status ON tutor_profiles(status);
```

**Relationships:**
- 1 Tutor Profile → 1 User
- 1 Tutor Profile → Many Tutor Subjects
- 1 Tutor Profile → Many Availabilities
- 1 Tutor Profile → Many Documents
- 1 Tutor Profile → Many Bookings
- 1 Tutor Profile → Many Reviews

---

#### `subjects`
```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category_id UUID REFERENCES subject_categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subjects_slug ON subjects(slug);
CREATE INDEX idx_subjects_category_id ON subjects(category_id);
CREATE INDEX idx_subjects_is_active ON subjects(is_active);
```

**Relationships:**
- Many Subjects → 1 Category

---

#### `subject_categories`
```sql
CREATE TABLE subject_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_slug ON subject_categories(slug);
```

**Examples:** Akademik, Bahasa, Skill, Hobi, Profesional

---

#### `tutor_subjects` (Pivot Table)
```sql
CREATE TABLE tutor_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  level VARCHAR(20) CHECK (level IN ('sd', 'smp', 'sma', 'university', 'professional', 'general')),
  price_override NUMERIC(12,2),
  currency VARCHAR(3) DEFAULT 'IDR',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tutor_profile_id, subject_id, level)
);

CREATE INDEX idx_tutor_subjects_tutor_id ON tutor_subjects(tutor_profile_id);
CREATE INDEX idx_tutor_subjects_subject_id ON tutor_subjects(subject_id);
CREATE INDEX idx_tutor_subjects_level ON tutor_subjects(level);
```

**Relationships:**
- Many-to-Many: Tutor Profiles ↔ Subjects

---

#### `tutor_documents`
```sql
CREATE TABLE tutor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  doc_type VARCHAR(50) CHECK (doc_type IN ('ktp', 'diploma', 'certificate', 'portfolio', 'other')),
  file_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tutor_docs_tutor_id ON tutor_documents(tutor_profile_id);
CREATE INDEX idx_tutor_docs_status ON tutor_documents(status);
```

**Relationships:**
- Many Documents → 1 Tutor Profile

---

### 3. Availability & Scheduling

#### `tutor_availabilities`
```sql
CREATE TABLE tutor_availabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_availabilities_tutor_id ON tutor_availabilities(tutor_profile_id);
CREATE INDEX idx_availabilities_day ON tutor_availabilities(day_of_week);
CREATE INDEX idx_availabilities_is_active ON tutor_availabilities(is_active);
```

**Relationships:**
- Many Availabilities → 1 Tutor Profile

---

#### `tutor_time_offs`
```sql
CREATE TABLE tutor_time_offs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_time_offs_tutor_id ON tutor_time_offs(tutor_profile_id);
CREATE INDEX idx_time_offs_dates ON tutor_time_offs(start_at, end_at);
```

**Relationships:**
- Many Time Offs → 1 Tutor Profile

---

### 4. Bookings (Core Business Logic)

#### `bookings`
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  tutor_subject_id UUID REFERENCES tutor_subjects(id) ON DELETE SET NULL,
  mode VARCHAR(20) CHECK (mode IN ('online', 'offline')),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location_type VARCHAR(50) CHECK (location_type IN ('student_place', 'tutor_place', 'public_place', 'online')),
  location_address TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  meeting_link TEXT,
  status VARCHAR(30) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_payment', 'confirmed', 'reschedule_requested', 'cancelled', 'completed', 'no_show', 'disputed')),
  cancelled_by VARCHAR(20) CHECK (cancelled_by IN ('student', 'tutor', 'system', 'admin')),
  cancel_reason TEXT,
  price NUMERIC(12,2) NOT NULL,
  platform_fee NUMERIC(12,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_student_id ON bookings(student_id);
CREATE INDEX idx_bookings_tutor_id ON bookings(tutor_profile_id);
CREATE INDEX idx_bookings_start_at ON bookings(start_at);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);
```

**Relationships:**
- Many Bookings → 1 Student (User)
- Many Bookings → 1 Tutor Profile
- Many Bookings → 1 Tutor Subject
- 1 Booking → 0..1 Payment Transaction
- 1 Booking → Many Status Logs
- 1 Booking → Many Progress Logs
- 1 Booking → 0..1 Review

---

#### `booking_status_logs`
```sql
CREATE TABLE booking_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_status VARCHAR(30),
  to_status VARCHAR(30) NOT NULL,
  changed_by_user_id UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_logs_booking_id ON booking_status_logs(booking_id);
CREATE INDEX idx_status_logs_created_at ON booking_status_logs(created_at DESC);
```

**Relationships:**
- Many Status Logs → 1 Booking

---

### 5. Payment & Escrow System

#### `payment_transactions`
```sql
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  provider VARCHAR(50) CHECK (provider IN ('midtrans', 'xendit', 'manual')),
  payment_method VARCHAR(50),
  external_payment_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_booking_id ON payment_transactions(booking_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_payments_external_id ON payment_transactions(external_payment_id);
```

**Relationships:**
- 1 Payment Transaction → 1 Booking

---

#### `wallets`
```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) DEFAULT 0.0,
  currency VARCHAR(3) DEFAULT 'IDR',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
```

**Relationships:**
- 1 Wallet → 1 User (Tutor)

---

#### `wallet_ledger_entries`
```sql
CREATE TABLE wallet_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('escrow_hold', 'release_to_tutor', 'platform_fee', 'refund', 'withdrawal')),
  amount NUMERIC(12,2) NOT NULL,
  booking_id UUID REFERENCES bookings(id),
  reference_id VARCHAR(255),
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ledger_wallet_id ON wallet_ledger_entries(wallet_id);
CREATE INDEX idx_ledger_booking_id ON wallet_ledger_entries(booking_id);
CREATE INDEX idx_ledger_type ON wallet_ledger_entries(type);
CREATE INDEX idx_ledger_created_at ON wallet_ledger_entries(created_at DESC);
```

**Escrow Flow:**
1. Payment `paid` → `escrow_hold`
2. Booking `completed` → `release_to_tutor` + `platform_fee`
3. Booking `cancelled` → `refund`

---

### 6. Chat System

#### `conversations`
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_by_user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, tutor_profile_id)
);

CREATE INDEX idx_conversations_student_id ON conversations(student_id);
CREATE INDEX idx_conversations_tutor_id ON conversations(tutor_profile_id);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
```

**Relationships:**
- 1 Conversation → 1 Student
- 1 Conversation → 1 Tutor Profile
- 1 Conversation → Many Messages

---

#### `messages`
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  content TEXT,
  file_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

**Relationships:**
- Many Messages → 1 Conversation
- Many Messages → 1 Sender (User)

---

### 7. Reviews & Ratings

#### `reviews`
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'removed')),
  moderated_by UUID REFERENCES users(id),
  moderated_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_tutor_id ON reviews(tutor_profile_id);
CREATE INDEX idx_reviews_author_id ON reviews(author_user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
```

**Business Rule:** 1 Booking = 1 Review (enforced by UNIQUE constraint)

**Relationships:**
- 1 Review → 1 Booking
- Many Reviews → 1 Tutor Profile
- Many Reviews → 1 Author (Student)

---

### 8. Progress Tracking (Unique Feature)

#### `progress_logs`
```sql
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  summary TEXT,
  homework TEXT,
  next_plan TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_progress_booking_id ON progress_logs(booking_id);
CREATE INDEX idx_progress_student_id ON progress_logs(student_id);
CREATE INDEX idx_progress_tutor_id ON progress_logs(tutor_profile_id);
CREATE INDEX idx_progress_created_at ON progress_logs(created_at DESC);
```

**Relationships:**
- Many Progress Logs → 1 Booking
- Many Progress Logs → 1 Student
- Many Progress Logs → 1 Tutor Profile

---

### 9. Favorites / Wishlist

#### `favorites`
```sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, tutor_profile_id)
);

CREATE INDEX idx_favorites_student_id ON favorites(student_id);
CREATE INDEX idx_favorites_tutor_id ON favorites(tutor_profile_id);
```

**Relationships:**
- Many-to-Many: Students ↔ Tutor Profiles

---

### 10. Lesson Packages (Optional but Recommended)

#### `lesson_packages`
```sql
CREATE TABLE lesson_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  tutor_subject_id UUID REFERENCES tutor_subjects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  session_count INTEGER NOT NULL,
  total_price NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  valid_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_packages_tutor_id ON lesson_packages(tutor_profile_id);
CREATE INDEX idx_packages_is_active ON lesson_packages(is_active);
```

**Relationships:**
- Many Packages → 1 Tutor Profile
- Many Packages → 1 Tutor Subject

---

#### `package_purchases`
```sql
CREATE TABLE package_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_package_id UUID NOT NULL REFERENCES lesson_packages(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'active', 'expired', 'cancelled')),
  sessions_remaining INTEGER NOT NULL,
  start_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_package_purchases_student_id ON package_purchases(student_id);
CREATE INDEX idx_package_purchases_package_id ON package_purchases(lesson_package_id);
CREATE INDEX idx_package_purchases_status ON package_purchases(status);
```

**Relationships:**
- Many Package Purchases → 1 Student
- Many Package Purchases → 1 Lesson Package

---

### 11. Reports & Moderation

#### `reports`
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type VARCHAR(50) CHECK (target_type IN ('user', 'tutor_profile', 'review', 'message', 'booking')),
  target_id UUID NOT NULL,
  reason VARCHAR(50) CHECK (reason IN ('spam', 'fraud', 'harassment', 'inappropriate', 'other')),
  description TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'rejected')),
  handled_by UUID REFERENCES users(id),
  handled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_reporter_id ON reports(reporter_user_id);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
```

**Relationships:**
- Many Reports → 1 Reporter (User)
- Many Reports → 1 Handler (Admin)

---

### 12. Notifications

#### `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

**Notification Types:**
- `booking_confirmed`
- `payment_received`
- `new_message`
- `lesson_reminder`
- `review_received`
- `verification_approved`

---

## Relationship Summary (Cardinality)

```
users (1) ←→ (0..1) tutor_profiles
users (1) ←→ (many) user_addresses
users (student) (1) ←→ (many) bookings
tutor_profiles (1) ←→ (many) bookings
tutor_profiles (1) ←→ (many) tutor_subjects ←→ (many) subjects
subjects (many) ←→ (1) subject_categories
tutor_profiles (1) ←→ (many) tutor_availabilities
tutor_profiles (1) ←→ (many) tutor_documents
bookings (1) ←→ (0..1) payment_transactions
bookings (1) ←→ (many) booking_status_logs
bookings (1) ←→ (many) progress_logs
bookings (1) ←→ (0..1) reviews
conversations (1) ←→ (many) messages
users (1) ←→ (1) wallets ←→ (many) wallet_ledger_entries
students (many) ←→ (many) tutor_profiles (via favorites)
tutor_profiles (1) ←→ (many) lesson_packages
students (1) ←→ (many) package_purchases
```

---

## Performance Optimization

### Indexes Strategy
1. **Primary lookups:** All foreign keys indexed
2. **Search queries:** GIN indexes for array/JSONB columns
3. **Full-text search:** `tsvector` on `tutor_profiles.bio`, `subjects.name`
4. **Geolocation:** PostGIS extension for location-based queries
5. **Composite indexes:** For common filter combinations

### Caching Strategy (Redis)
- Tutor search results (5 min TTL)
- User sessions (JWT)
- Real-time chat messages
- Notification counts
- Availability slots

### Database Partitioning
- **bookings:** Partition by `start_at` (monthly)
- **messages:** Partition by `created_at` (monthly)
- **notifications:** Partition by `created_at` (monthly)
- **wallet_ledger_entries:** Partition by `created_at` (monthly)

---

## Data Integrity & Business Rules

1. **Cascade Deletes:** User deletion cascades to related records
2. **Soft Deletes:** Use `status = 'deleted'` for users, `deleted_at` for critical tables
3. **Audit Trail:** All tables have `created_at`, `updated_at`
4. **Constraints:** Enforce business rules at DB level (CHECK constraints)
5. **Transactions:** Use for payment, booking, wallet operations
6. **Unique Constraints:**
   - 1 booking = 1 review
   - 1 booking = 1 payment
   - 1 student-tutor pair = 1 conversation
   - 1 student-tutor pair = 1 favorite

---

## Migration Strategy

### Phase 1: Foundation (Sprint 1-2)
```sql
-- Core tables
users
user_addresses
tutor_profiles
subject_categories
subjects
tutor_subjects
tutor_availabilities
tutor_documents
```

### Phase 2: Booking System (Sprint 3-4)
```sql
bookings
booking_status_logs
payment_transactions
wallets
wallet_ledger_entries
```

### Phase 3: Social Features (Sprint 5-6)
```sql
conversations
messages
reviews
favorites
notifications
```

### Phase 4: Advanced Features (Sprint 7-9)
```sql
progress_logs
lesson_packages
package_purchases
reports
tutor_time_offs
```

---

## SQL Example Queries

### Search Tutors with Filters
```sql
SELECT 
  tp.*,
  u.full_name,
  u.avatar_url,
  COUNT(DISTINCT r.id) as review_count,
  AVG(r.rating) as avg_rating
FROM tutor_profiles tp
JOIN users u ON tp.user_id = u.id
JOIN tutor_subjects ts ON tp.id = ts.tutor_profile_id
JOIN subjects s ON ts.subject_id = s.id
LEFT JOIN reviews r ON tp.id = r.tutor_profile_id AND r.status = 'published'
WHERE 
  tp.status = 'active'
  AND tp.is_verified = true
  AND s.slug = 'matematika'
  AND ts.level = 'sma'
  AND tp.hourly_rate BETWEEN 50000 AND 200000
  AND tp.base_city = 'Jakarta'
GROUP BY tp.id, u.id
HAVING AVG(r.rating) >= 4.0
ORDER BY avg_rating DESC, tp.completed_lessons_count DESC
LIMIT 20;
```

### Get Tutor Availability
```sql
SELECT 
  ta.day_of_week,
  ta.start_time,
  ta.end_time
FROM tutor_availabilities ta
WHERE 
  ta.tutor_profile_id = 'uuid-here'
  AND ta.is_active = true
  AND NOT EXISTS (
    SELECT 1 FROM tutor_time_offs tto
    WHERE tto.tutor_profile_id = ta.tutor_profile_id
    AND CURRENT_DATE BETWEEN DATE(tto.start_at) AND DATE(tto.end_at)
  )
ORDER BY ta.day_of_week, ta.start_time;
```

### Escrow Release on Booking Completion
```sql
BEGIN;

-- Update booking status
UPDATE bookings 
SET status = 'completed', updated_at = NOW()
WHERE id = 'booking-uuid';

-- Release payment to tutor
INSERT INTO wallet_ledger_entries (wallet_id, type, amount, booking_id)
SELECT 
  w.id,
  'release_to_tutor',
  b.price - b.platform_fee,
  b.id
FROM bookings b
JOIN tutor_profiles tp ON b.tutor_profile_id = tp.id
JOIN wallets w ON tp.user_id = w.user_id
WHERE b.id = 'booking-uuid';

-- Update wallet balance
UPDATE wallets w
SET balance = balance + (b.price - b.platform_fee)
FROM bookings b
JOIN tutor_profiles tp ON b.tutor_profile_id = tp.id
WHERE w.user_id = tp.user_id AND b.id = 'booking-uuid';

COMMIT;
```
