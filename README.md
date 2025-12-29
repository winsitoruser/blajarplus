# Blajarplus - Platform Pembelajaran Online

Platform marketplace untuk menghubungkan pelajar dengan pengajar berkualitas di Indonesia.

## 🎯 Vision & Mission

**Vision:** Menjadi platform pembelajaran online terdepan di Indonesia yang menghubungkan pelajar dengan pengajar berkualitas.

**Mission:** Memberikan akses pendidikan berkualitas yang terjangkau dan personal untuk semua kalangan.

## 🚀 Key Differentiators vs Superprof

1. **Progress Tracking System** - Fitur unik untuk tracking kemajuan belajar
2. **Escrow Payment System** - Keamanan transaksi dengan sistem escrow
3. **Verified Tutors** - Proses verifikasi ketat untuk kualitas pengajar
4. **Indonesian Market Focus** - Disesuaikan dengan kebutuhan pasar Indonesia
5. **Integrated Chat System** - Komunikasi real-time antara pelajar dan pengajar

## 📅 Timeline Overview

**Total Duration:** 17 minggu (4 bulan)
- **Phase 1 - Foundation:** Sprint 1-2 (4 minggu)
- **Phase 2 - Core System:** Sprint 3-4 (4 minggu)
- **Phase 3 - Payment & Verification:** Sprint 5-6 (4 minggu)
- **Phase 4 - Enhancement:** Sprint 7-9 (5 minggu)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js / Next.js
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **State Management:** React Context / Zustand

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js / NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma / TypeORM
- **Authentication:** JWT + bcrypt

### Payment Integration
- **Primary:** Midtrans
- **Alternative:** Xendit

### Real-time Communication
- **Chat:** Socket.io / Firebase Realtime Database

### Deployment
- **Frontend:** Vercel / Netlify
- **Backend:** Railway / Heroku
- **Database:** Supabase / Railway

## 👥 Team Roles

- **Product Manager** - Product strategy & roadmap
- **UI/UX Designer** - Design system & user experience
- **Frontend Developer** - Client-side implementation
- **Backend Developer** - Server & database implementation
- **QA Engineer** - Testing & quality assurance

## 📁 Project Structure

```
blajarplus/
├── docs/                    # Documentation
│   ├── database-schema.md   # Database ERD & schema
│   ├── user-flows.md        # User journey maps
│   ├── flow-diagrams.md     # State machines & flows
│   ├── pages-components.md  # Page & component specs
│   └── development-tasks.md # Task tracker
├── frontend/                # Frontend application
├── backend/                 # Backend API
└── README.md               # This file
```

## 🎨 Design Guidelines

### Color Palette
- **Primary (Blue):** #2563EB - Trust, professionalism, stability
- **Secondary (Orange):** #F97316 - Energy, enthusiasm, warmth
- **Success:** #10B981
- **Warning:** #F59E0B
- **Error:** #EF4444
- **Neutral Gray:** #6B7280

### Typography
- **Headings:** Inter / Poppins (Bold)
- **Body:** Inter / Open Sans (Regular)

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `/docs`:
- [Database Schema](./docs/database-schema.md)
- [User Flows & Journey Maps](./docs/user-flows.md)
- [Flow Diagrams](./docs/flow-diagrams.md)
- [Pages & Components](./docs/pages-components.md)
- [Development Tasks](./docs/development-tasks.md)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm / yarn / pnpm

### Installation
```bash
# Clone repository
git clone <repository-url>

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Setup database
npm run db:setup

# Run development servers
npm run dev
```

## 📝 License

Proprietary - All rights reserved
