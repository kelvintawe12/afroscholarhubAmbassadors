# Remove Mocks from Country Lead Pages

## Progress Tracking

### 1. CountryLeadDashboard.tsx ✅
- [x] Replace impactMetricsData with useCountryLeadKPIs
- [x] Replace activities with useRecentActivities
- [x] Replace pipelineStages with calculated data from schools

### 2. PipelinePage.tsx
- [ ] Replace pipelineStats with getCountryMetrics
- [ ] Replace schoolsData with getCountryPipeline
- [ ] Replace stageSummary with calculated data
- [ ] Replace recentActivities with useRecentActivities
- [ ] Replace ambassadors with getCountryAmbassadors

### 3. GlobalPeekPage.tsx
- [ ] Replace countries with real country data
- [ ] Replace quickStats with aggregated data
- [ ] Replace recentActivities with useRecentActivities

### 4. ReportsPage.tsx
- [ ] Replace reportMetrics with real metrics
- [ ] Replace recentReports with real reports (may need new API)
- [ ] Replace chart data with real data
- [ ] Replace recentActivities with useRecentActivities

### 5. ResourcesPage.tsx
- [ ] Replace resourceCategories with real data (may need new API)
- [ ] Replace featuredResources with real data
- [ ] Replace allResources with real data
- [ ] Replace quickLinks with real data

### 6. TeamPage.tsx
- [ ] Replace ambassadors with getCountryAmbassadors

## New APIs Needed
- [ ] Reports API functions
- [ ] Resources API functions
- [ ] Global country metrics API

## Testing
- [ ] Test each page after changes
- [ ] Handle loading/error states
- [ ] Ensure proper data formatting
