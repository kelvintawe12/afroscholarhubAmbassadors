# Ambassador Dashboard Implementation Plan

## Overview
Implement real functionality for placeholder pages in ambassador dashboards.

## Tasks
- [x] Implement SchoolsPage: Display assigned schools with status, leads, last visit, and actions
- [x] Implement ImpactPage: Show impact metrics, charts, and achievements
- [x] Implement ResourcesPage: List downloadable resources and materials
- [x] Implement SupportPage: Provide FAQs, contact options, and help articles
- [x] Implement ActivityLogPage: Display activity history and visit logs

## Files to Edit
- src/components/dashboards/ambassador/SchoolsPage.tsx
- src/components/dashboards/ambassador/ImpactPage.tsx
- src/components/dashboards/ambassador/ResourcesPage.tsx
- src/components/dashboards/ambassador/SupportPage.tsx
- src/components/dashboards/ambassador/ActivityLogPage.tsx

## Dependencies
- Use existing API functions from src/api/ambassador.ts
- Leverage components like DataTable, KpiCard, BarChart, LineChart
- Mock data for resources and support content

## Followup Steps
- Test each page for functionality
- Ensure responsive design
- Verify integration with navigation
