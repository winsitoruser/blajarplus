# Blajarplus Frontend

Frontend application untuk platform Blajarplus - marketplace untuk tutor dan pelajar.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui + Radix UI
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+
- Backend API running on http://localhost:3000

## Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Frontend akan berjalan di: **http://localhost:3001**

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   │       └── button.tsx
│   └── lib/
│       ├── api.ts             # API client
│       └── utils.ts           # Utility functions
├── public/                     # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration
└── package.json
```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 3001

# Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

## Features

### Current
- ✅ Homepage with hero section
- ✅ Responsive design
- ✅ TailwindCSS styling
- ✅ API client setup
- ✅ Button component

### Coming Soon
- 🔨 Login/Register pages
- 🔨 Search & Filter
- 🔨 Tutor profiles
- 🔨 Booking system
- 🔨 Chat interface
- 🔨 Dashboard (Student & Tutor)

## Development Notes

### Adding New Pages

Create new page in `src/app/`:
```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>
}
```

### Adding New Components

Create component in `src/components/`:
```tsx
// src/components/MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>
}
```

### API Calls

Use the API client:
```tsx
import { authApi } from '@/lib/api'

const handleLogin = async () => {
  const response = await authApi.login({ email, password })
  console.log(response.data)
}
```

## Styling

Using TailwindCSS with custom color scheme:
- Primary: Sky Blue (#0ea5e9)
- Secondary: Orange (#f97316)

Example:
```tsx
<div className="bg-primary-500 text-white p-4 rounded-lg">
  Hello World
</div>
```

## License

Proprietary - All rights reserved
