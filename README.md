# Afroscholarhub Ambassadors Dashboard

Afroscholarhub is a platform connecting African scholars to share, discover, and collaborate on research. This repository contains the Ambassadors Dashboard – a role-based web application for managing outreach, schools, events, tasks, reports, and more. Built for ambassadors, country leads, management, and support teams to track impact and drive educational partnerships across Africa.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite (build tool), Tailwind CSS (styling), Lucide React (icons), React Router (routing), React Hot Toast (notifications), Chart.js + React-Chartjs-2 (charts)
- **Backend/Database**: Supabase (PostgreSQL with auth, RLS, real-time), custom SQL migrations and seeds
- **Testing**: Vitest, Testing Library (React, Jest-DOM, User-Event)
- **PWA**: Manifest.json, Service Worker for offline support
- **Deployment**: Vercel (serverless, with vercel.json config)
- **Other**: Prettier (formatting), ESLint (linting), jsPDF (PDF generation for reports)

## Roles & Features
- **Ambassador**: Personal dashboard for tasks, schools, visits, impact metrics, resources, training, profile/settings.
- **Country Lead**: Team management, escalations, pipeline, events, reports, resources, global peek.
- **Management**: Analytics, insights, ambassadors performance/training, schools (prospects/partnerships), outreaches (events/calendar), reports (custom/weekly/monthly/quarterly).
- **Support**: Directory, audits, moderation, queues, reports, resources.
- **Shared**: Auth (login/forgot/reset), PWA install prompt, error boundaries, loading spinners, UI widgets (KPI cards, charts, data tables).

All pages integrate with real Supabase database (no mocks); data fetched via API modules and hooks. Placeholders have been replaced with functional components using DataTable, charts, forms, etc.

## Setup Instructions

### Prerequisites
- Node.js >=18
- Supabase account (free tier sufficient)
- Git

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd afroscholarhubAmbassadors
npm install
```

### 2. Supabase Configuration
1. Create a new Supabase project at [supabase.com](https://supabase.com).
2. In your Supabase dashboard:
   - Go to Settings > API: Copy your Project URL and anon/public key.
   - Run all migrations: SQL Editor > Run backend/sql/migrations/*.sql (001_create_tables.sql to 008_fix_escalations_schema.sql, plus announcements.sql, 100_followup.sql, 110._training.sql).
   - Run seeds: SQL Editor > Run backend/sql/seeds/001_seed_data_complete_fixed.sql for test data (users, schools, tasks, etc.).
   - Enable Row Level Security (RLS) and verify policies (e.g., users can only see own data).
3. Create `.env` in root (copy from `.env.example` if added):
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Development
```bash
npm run dev  # Starts at http://localhost:5173
```
- Login with Supabase auth (email/password or OAuth if configured).
- Navigate via Sidebar (role-based after login).
- Test PWA: Install prompt appears; service worker caches assets.

### 4. Build & Preview
```bash
npm run build  # Outputs to dist/
npm run preview  # Local server for built app
```

### 5. Testing
```bash
npm run test  # Run all tests
npm run test:ui  # UI mode
npm run test:coverage  # Coverage report
```
- Covers API queries, components (e.g., KpiCard, LoadingSpinner), hooks.
- Run manually: Check all dashboard pages load real data (no placeholders), CRUD operations (create task/school/event), charts render aggregates.

### 6. Deployment to Vercel
1. Push to GitHub.
2. Connect repo to Vercel dashboard.
3. Add env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY).
4. Deploy – automatic on push to main.

## Project Structure
- **src/**: React source
  - **api/**: Supabase query functions (ambassador.ts, country-lead.ts, etc.)
  - **components/**: UI (dashboards by role, shared widgets, layout)
  - **contexts/**: AuthContext for user/role
  - **hooks/**: useAuth, useDashboardData, useApi, etc.
  - **utils/**: supabase.ts (client/types), logger.ts
- **backend/sql/**: Migrations (schema), seeds (data)
- **public/**: Assets (icons, manifest.json, service-worker.js)
- **tests**: Vitest setup

## Database Schema Overview
- **Core Tables**: users (roles, performance), countries, schools (status, metrics), visits (outreach), tasks, events, resources.
- **Extensions**: Escalations (support), reports (management), training_progress, audit_logs.
- **Features**: UUIDs, JSONB for flexible data, triggers for audits, indexes for performance, RLS for security.

## Contributing
- Follow TypeScript/Tailwind best practices.
- Lint: `npm run lint`
- Format: `npm run format` (Prettier)
- Update TODO.md for progress.
- Issues: Report schema mismatches, RLS bugs, or missing features.

## License
MIT – See LICENSE (or add one).

For support, contact the development team or check Supabase docs.
