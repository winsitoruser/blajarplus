# Blajarplus Backend API

Backend API untuk platform Blajarplus - marketplace untuk tutor dan pelajar.

## Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT + Passport
- **Documentation:** Swagger/OpenAPI
- **Payment:** Midtrans

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm/yarn/pnpm

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# Minimal required:
# - DATABASE_URL
# - JWT_SECRET
```

## Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npm run prisma:seed

# (Optional) Open Prisma Studio
npm run prisma:studio
```

## Running the App

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Setelah server berjalan, akses dokumentasi API di:
- **Swagger UI:** http://localhost:3000/api/docs

## Available Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login

### Users
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile

### Tutors
- Coming soon...

### Bookings
- Coming soon...

### Payments
- Coming soon...

### Chat
- Coming soon...

### Reviews
- Coming soon...

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── auth/                  # Authentication module
│   │   ├── dto/              # Data transfer objects
│   │   ├── strategies/       # Passport strategies
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                 # Users module
│   ├── tutors/                # Tutors module
│   ├── bookings/              # Bookings module
│   ├── payments/              # Payments module
│   ├── chat/                  # Chat module
│   ├── reviews/               # Reviews module
│   ├── prisma/                # Prisma service
│   ├── app.module.ts          # Root module
│   └── main.ts                # Entry point
├── .env.example
├── package.json
└── README.md
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blajarplus"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"

# Midtrans (optional)
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development Notes

### Lint Errors
Error TypeScript yang muncul di IDE adalah normal sebelum `npm install`. Jalankan instalasi terlebih dahulu.

### Database Migrations
Setiap perubahan schema di `prisma/schema.prisma` memerlukan migration baru:
```bash
npm run prisma:migrate
```

### Adding New Modules
```bash
# Generate module dengan NestJS CLI
nest g module module-name
nest g controller module-name
nest g service module-name
```

## License

Proprietary - All rights reserved
