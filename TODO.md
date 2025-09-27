# Management Reports Implementation Plan

## Completed Tasks
- [x] Fixed database schema mismatch: Changed `escalated_by` to `reporter_id` in Escalation interface and API queries
- [x] Updated TypeScript interface: `escalated_by` → `reporter_id`, `escalated_by_user` → `reporter_user`, `assigned_to` → `assignee_id`, `ticket_number` → `ticket_id`
- [x] Updated API queries in `src/api/escalations.ts` to use correct column names and foreign key relationships
- [x] Updated component `src/components/dashboards/country-lead/EscalationsPage.tsx` to use new property names and enum values
- [x] Updated status enum: 'Open'/'Assigned'/'In Progress' → 'new'/'assigned'/'in_progress'/'escalated'/'resolved'/'closed'/'reopened'
- [x] Updated priority enum: 'Low'/'Medium'/'High'/'Critical' → 'low'/'medium'/'high'/'critical'
- [x] Updated impact enum: 'Low'/'Medium'/'High'/'Critical' → 'single_student'/'multiple_students'/'regional'/'national'/'system_wide'
- [x] Updated category enum: 'school_issue'/'ambassador_issue' → 'scholarship'/'ambassador'/'compliance'/'technical'/'partner'/'system'/'finance'
- [x] Added Global Peek page routes for all dashboard types:
  - Management: `/dashboard/management/global`
  - Ambassador: `/dashboard/ambassador/global`
  - Support: `/dashboard/support/global`
  - Country Lead: `/dashboard/country-lead/:countryCode/global` (already existed)

## In Progress: Management Reports Enhancement

### Database Updates
- [x] Create migration `backend/sql/migrations/009_create_reports_table.sql` for 'reports' table with id, name, type, start_date, end_date, metrics, data, status, created_by, timestamps
- [x] Enable RLS on reports table with policy for management role access

### API Layer
- [x] Create `src/api/reports.ts` with functions: createReport, getReports, getReportById, generateReportMetrics (aggregate from schools, ambassadors, visits tables)
- [x] Extend `src/api/management.ts` for broader management queries if needed

### Component Updates
- [x] Update `CreateReportModal.tsx`: Replace mock insert with real Supabase call; add error handling
- [x] Update `CustomReportsPage.tsx`: Fetch saved reports via API; integrate filters with generateReportMetrics; update preview with real data
- [x] Update `MonthlyReportsPage.tsx`: Replace mock data with API calls based on month/country; enhance export (add jsPDF dep if needed)
- [x] Update `WeeklyReportsPage.tsx`: Fetch real data in useEffect; replace mock reportData with dynamic queries
- [x] Update `QuarterlyReportsPage.tsx`: Fetch quarterly aggregates; update goals progress with DB targets

### UI/UX Enhancements
- [x] Add loading states and error handling across report pages
- [x] Ensure role-based access (management only)
- [x] Update Sidebar.tsx if new sub-routes needed

### Testing & Validation
- [x] Add Vitest tests for reports API
- [x] Verify RLS policies and DB schema
- [x] Test pages with real data via `npm run dev`

## Summary
The original error "Could not find a relationship between 'escalations' and 'escalated_by'" was caused by a mismatch between the database schema (using `reporter_id` from migration 002) and the code (using `escalated_by` from migration 006). The code has been updated to align with the actual database schema using `reporter_id` as the foreign key column.

All escalations-related TypeScript errors have been resolved and the escalations API should now work correctly with proper foreign key relationships. The Global Peek page is now available across all dashboard types. The remaining TypeScript errors in the codebase are unrelated to the escalations functionality and can be addressed separately.
