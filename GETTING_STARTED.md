# Getting Started - Blajarplus Development

Panduan lengkap untuk memulai development Blajarplus dari awal.

## 📋 Prerequisites

Pastikan sudah terinstall:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

## 🚀 Quick Start

### 1. Setup Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Buat database baru
CREATE DATABASE blajarplus;

# Keluar dari psql
\q
```

### 2. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env file dengan database credentials Anda
# Minimal yang perlu diubah:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/blajarplus"
# JWT_SECRET="ganti-dengan-secret-key-yang-aman"

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed database dengan data awal
npm run prisma:seed

# Start development server
npm run start:dev
```

Backend akan berjalan di: **http://localhost:3000**
API Documentation: **http://localhost:3000/api/docs**

### 3. Setup Frontend (Coming Soon)

Frontend dengan Next.js akan dibuat di folder `frontend/`.

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3001**

## 📁 Project Structure

```
Blajarplus/
├── docs/                          # Dokumentasi lengkap
│   ├── database-schema.md         # ERD & Database schema
│   ├── user-flows.md              # User journey maps
│   ├── flow-diagrams.md           # Visual flow diagrams
│   ├── development-tasks.md       # Task breakdown (2,775 hours)
│   └── pages-components.md        # Page & component specs
│
├── backend/                       # NestJS Backend API
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Database seeder
│   ├── src/
│   │   ├── auth/                  # ✅ Authentication (JWT + Google OAuth)
│   │   ├── users/                 # ✅ User management
│   │   ├── tutors/                # 🔨 Tutor profiles (stub)
│   │   ├── bookings/              # 🔨 Booking system (stub)
│   │   ├── payments/              # 🔨 Payment & escrow (stub)
│   │   ├── chat/                  # 🔨 Real-time chat (stub)
│   │   ├── reviews/               # 🔨 Reviews & ratings (stub)
│   │   ├── prisma/                # Prisma service
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/                      # 🔨 Next.js Frontend (to be created)
│
└── README.md                      # Project overview
```

## 🧪 Testing Backend

### Test Authentication

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Password123",
    "fullName": "John Doe",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrPhone": "student@example.com",
    "password": "Password123"
  }'

# Get current user (replace TOKEN with actual token from login)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Swagger UI

Lebih mudah test API menggunakan Swagger:
1. Buka http://localhost:3000/api/docs
2. Klik endpoint yang ingin ditest
3. Klik "Try it out"
4. Isi parameter dan klik "Execute"

## 🗄️ Database Management

### Prisma Studio (GUI)

```bash
cd backend
npm run prisma:studio
```

Buka http://localhost:5555 untuk GUI database.

### Common Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Seed database
npm run prisma:seed
```

## 🔧 Development Workflow

### Phase 1: Foundation (Current)
- ✅ Project structure
- ✅ Database schema (20+ tables)
- ✅ Authentication system (JWT + Google OAuth)
- ✅ User management
- 🔨 Stub modules (tutors, bookings, payments, chat, reviews)

### Phase 2: Core Features (Next)
1. **Tutors Module**
   - Tutor registration & profile
   - Subject & availability management
   - Document verification

2. **Search & Filter**
   - Tutor search with filters
   - Sort & pagination

3. **Booking System**
   - Create booking
   - Manage bookings
   - Cancel with refund logic

4. **Chat System**
   - Real-time messaging (Socket.io)
   - File sharing

### Phase 3: Payment & Admin
- Payment integration (Midtrans)
- Escrow system
- Admin panel
- Verification workflow

### Phase 4: Enhancement
- Progress tracking
- Reviews & ratings
- Earnings & withdrawals
- Testing & optimization

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/blajarplus"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3000/api/auth/google/callback"

# Redis (Optional - for caching)
REDIS_HOST="localhost"
REDIS_PORT=6379

# Midtrans (Optional - for payments)
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"
MIDTRANS_IS_PRODUCTION=false

# App
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3001"
```

## 🐛 Troubleshooting

### Error: Cannot find module '@nestjs/...'

**Solusi:** Dependencies belum terinstall
```bash
cd backend
npm install
```

### Error: Can't reach database server

**Solusi:** PostgreSQL belum berjalan atau credentials salah
```bash
# Cek status PostgreSQL
# Mac:
brew services list

# Start PostgreSQL jika belum running
brew services start postgresql@14

# Cek connection string di .env
```

### Error: Prisma Client not generated

**Solusi:** Generate Prisma Client
```bash
cd backend
npm run prisma:generate
```

### Port 3000 already in use

**Solusi:** Ubah PORT di .env atau kill process yang menggunakan port 3000
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 PID
```

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `/docs`:

1. **[database-schema.md](./docs/database-schema.md)**
   - Complete ERD dengan 20+ tables
   - SQL schema dengan indexes
   - Performance optimization
   - Migration strategy

2. **[user-flows.md](./docs/user-flows.md)**
   - Student flows (8 flows)
   - Tutor flows (6 flows)
   - Admin flows (3 flows)
   - Edge cases & business rules

3. **[flow-diagrams.md](./docs/flow-diagrams.md)**
   - Visual box + arrows diagrams
   - State machines
   - Ready for Figma/Whimsical

4. **[development-tasks.md](./docs/development-tasks.md)**
   - 2,775 hours task breakdown
   - 9 sprints, 4 phases
   - Team allocation
   - Timeline 17 weeks

5. **[pages-components.md](./docs/pages-components.md)**
   - 24 pages specification
   - 50+ components
   - Design system
   - Component hierarchy

## 🎯 Next Steps

### Immediate (This Week)
1. ✅ Setup development environment
2. ✅ Test authentication endpoints
3. 🔨 Implement Tutors module
4. 🔨 Create frontend structure

### Short Term (This Month)
1. Complete search & filter
2. Implement booking system
3. Setup real-time chat
4. Create basic UI components

### Long Term (Next 3 Months)
1. Payment integration
2. Admin panel
3. Progress tracking
4. Testing & deployment

## 💡 Tips

### VS Code Extensions (Recommended)
- Prisma
- ESLint
- Prettier
- REST Client
- GitLens

### Useful Commands

```bash
# Format code
npm run lint

# Watch mode (auto-reload)
npm run start:dev

# Debug mode
npm run start:debug

# Build for production
npm run build
```

## 🤝 Contributing

Untuk menambah fitur baru:

1. Buat branch baru
```bash
git checkout -b feature/nama-fitur
```

2. Develop & test

3. Commit dengan message yang jelas
```bash
git commit -m "feat: add tutor search with filters"
```

4. Push & create PR

## 📞 Support

Jika ada pertanyaan atau issue:
1. Cek dokumentasi di folder `/docs`
2. Lihat Swagger API docs
3. Review error logs

## 🎉 Ready to Code!

Sekarang Anda siap untuk mulai development. Mulai dengan:

```bash
cd backend
npm run start:dev
```

Kemudian buka http://localhost:3000/api/docs dan explore API!

Happy coding! 🚀
