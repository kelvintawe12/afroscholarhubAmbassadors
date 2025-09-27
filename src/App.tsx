import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load all components for code splitting
const LoginPage = React.lazy(() => import('./components/LoginPage').then(module => ({ default: module.LoginPage })));
const DashboardLayout = React.lazy(() => import('./components/layout/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
const PWAInstallPrompt = React.lazy(() => import('./components/PWAInstallPrompt').then(module => ({ default: module.default })));

// Management Dashboard Components
const ManagementDashboard = React.lazy(() => import('./components/dashboards/management/ManagementDashboard').then(module => ({ default: module.ManagementDashboard })));
const AnalyticsPage = React.lazy(() => import('./components/dashboards/management/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const InsightsPage = React.lazy(() => import('./components/dashboards/management/InsightsPage').then(module => ({ default: module.InsightsPage })));

// Country Lead Dashboard Components
const CountryLeadDashboard = React.lazy(() => import('./components/dashboards/country-lead/CountryLeadDashboard').then(module => ({ default: module.CountryLeadDashboard })));
const TeamPage = React.lazy(() => import('./components/dashboards/country-lead/TeamPage').then(module => ({ default: module.TeamPage })));
const PipelinePage = React.lazy(() => import('./components/dashboards/country-lead/PipelinePage').then(module => ({ default: module.default })));
const EventsPage = React.lazy(() => import('./components/dashboards/country-lead/EventsPage').then(module => ({ default: module.default })));
const ResourcesPage = React.lazy(() => import('./components/dashboards/country-lead/ResourcesPage').then(module => ({ default: module.default })));
const EscalationsPage = React.lazy(() => import('./components/dashboards/country-lead/EscalationsPage').then(module => ({ default: module.default })));
const GlobalPeekPage = React.lazy(() => import('./components/dashboards/country-lead/GlobalPeekPage').then(module => ({ default: module.default })));
const ReportsPage = React.lazy(() => import('./components/dashboards/country-lead/ReportsPage').then(module => ({ default: module.default })));

// Ambassador Dashboard Components
const AmbassadorDashboard = React.lazy(() => import('./components/dashboards/ambassador/AmbassadorDashboard').then(module => ({ default: module.AmbassadorDashboard })));
const TasksPage = React.lazy(() => import('./components/dashboards/ambassador/TasksPage').then(module => ({ default: module.TasksPage })));
const AmbassadorSchoolsPage = React.lazy(() => import('./components/dashboards/ambassador/SchoolsPage').then(module => ({ default: module.SchoolsPage })));
const ActivityLogPage = React.lazy(() => import('./components/dashboards/ambassador/ActivityLogPage').then(module => ({ default: module.ActivityLogPage })));
const AmbassadorResourcesPage = React.lazy(() => import('./components/dashboards/ambassador/ResourcesPage').then(module => ({ default: module.AmbassadorResourcesPage })));
const ImpactPage = React.lazy(() => import('./components/dashboards/ambassador/ImpactPage').then(module => ({ default: module.ImpactPage })));
const SupportPage = React.lazy(() => import('./components/dashboards/ambassador/SupportPage').then(module => ({ default: module.SupportPage })));
const ProfilePage = React.lazy(() => import('./components/dashboards/ambassador/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SettingsPage = React.lazy(() => import('./components/dashboards/ambassador/SettingsPage').then(module => ({ default: module.SettingsPage })));
const AmbassadorTrainingViewPage = React.lazy(() =>
  import('./components/dashboards/ambassador/TrainingPage').then(module => ({
    default: module.AmbassadorTrainingViewPage
  }))
);

// Management Ambassador Components
const AmbassadorsPage = React.lazy(() => import('./components/dashboards/management/ambassadors/AmbassadorsPage').then(module => ({ default: module.default })));
const AmbassadorPerformancePage = React.lazy(() => import('./components/dashboards/management/ambassadors/PerformancePage').then(module => ({ default: module.AmbassadorPerformancePage })));
const AmbassadorTrainingPage = React.lazy(() => import('./components/dashboards/management/ambassadors/TrainingPage').then(module => ({ default: module.AmbassadorTrainingPage })));

// Management Schools Components
const SchoolsPage = React.lazy(() => import('./components/dashboards/management/schools/SchoolsPage').then(module => ({ default: module.SchoolsPage })));
const SchoolProspectsPage = React.lazy(() => import('./components/dashboards/management/schools/ProspectsPage').then(module => ({ default: module.SchoolProspectsPage })));
const SchoolPartnershipsPage = React.lazy(() => import('./components/dashboards/management/schools/PartnershipsPage').then(module => ({ default: module.SchoolPartnershipsPage })));

// Management Outreaches Components
const OutreachEventsPage = React.lazy(() => import('./components/dashboards/management/outreaches/EventsPage').then(module => ({ default: module.OutreachEventsPage })));
const OutreachPipelinePage = React.lazy(() => import('./components/dashboards/management/outreaches/PipelinePage').then(module => ({ default: module.OutreachPipelinePage })));
const CalendarPage = React.lazy(() => import('./components/dashboards/management/outreaches/CalendarPage').then(module => ({ default: module.CalendarPage })));
const EventCreatePage = React.lazy(() => import('./components/dashboards/management/outreaches/EventCreatePage').then(module => ({ default: module.EventCreatePage })));
const EventEditPage = React.lazy(() => import('./components/dashboards/management/outreaches/EventEditPage').then(module => ({ default: module.EventEditPage })));

// Management Reports Components
const WeeklyReportsPage = React.lazy(() => import('./components/dashboards/management/reports/WeeklyReportsPage').then(module => ({ default: module.WeeklyReportsPage })));
const MonthlyReportsPage = React.lazy(() => import('./components/dashboards/management/reports/MonthlyReportsPage').then(module => ({ default: module.MonthlyReportsPage })));
const QuarterlyReportsPage = React.lazy(() => import('./components/dashboards/management/reports/QuarterlyReportsPage').then(module => ({ default: module.QuarterlyReportsPage })));
const CustomReportsPage = React.lazy(() => import('./components/dashboards/management/reports/CustomReportsPage').then(module => ({ default: module.CustomReportsPage })));

// Support Dashboard Components
const SupportDashboard = React.lazy(() => import('./components/dashboards/support/SupportDashboard').then(module => ({ default: module.SupportDashboard })));
const QueuesPage = React.lazy(() => import('./components/dashboards/support/QueuesPage').then(module => ({ default: module.QueuesPage })));
const SupportResourcesPage = React.lazy(() => import('./components/dashboards/support/ResourcesPage').then(module => ({ default: module.SupportResourcesPage })));
const SupportReportsPage = React.lazy(() => import('./components/dashboards/support/ReportsPage').then(module => ({ default: module.SupportReportsPage })));
const ModerationPage = React.lazy(() => import('./components/dashboards/support/ModerationPage').then(module => ({ default: module.ModerationPage })));
const AuditsPage = React.lazy(() => import('./components/dashboards/support/AuditsPage').then(module => ({ default: module.AuditsPage })));
const DirectoryPage = React.lazy(() => import('./components/dashboards/support/DirectoryPage').then(module => ({ default: module.DirectoryPage })));

// Help Components
const HelpCenterPage = React.lazy(() => import('./components/help/HelpCenterPage').then(module => ({ default: module.HelpCenterPage })));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingFallback />}>
              <PWAInstallPrompt />
              <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Management Routes */}
              <Route
                path="/dashboard/management"
                element={
                  <DashboardLayout>
                    <ManagementDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/global"
                element={
                  <DashboardLayout>
                    <GlobalPeekPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/analytics"
                element={
                  <DashboardLayout>
                    <AnalyticsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/insights"
                element={
                  <DashboardLayout>
                    <InsightsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/ambassadors"
                element={
                  <DashboardLayout>
                    <AmbassadorsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/ambassadors/performance"
                element={
                  <DashboardLayout>
                    <AmbassadorPerformancePage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/ambassadors/training"
                element={
                  <DashboardLayout>
                    <AmbassadorTrainingPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/schools"
                element={
                  <DashboardLayout>
                    <SchoolsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/schools/prospects"
                element={
                  <DashboardLayout>
                    <SchoolProspectsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/schools/partnerships"
                element={
                  <DashboardLayout>
                    <SchoolPartnershipsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/outreaches/events"
                element={
                  <DashboardLayout>
                    <OutreachEventsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/outreaches/events/new"
                element={
                  <DashboardLayout>
                    <EventCreatePage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/outreaches/events/:id/edit"
                element={
                  <DashboardLayout>
                    <EventEditPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/outreaches/pipeline"
                element={
                  <DashboardLayout>
                    <OutreachPipelinePage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/outreaches/calendar"
                element={
                  <DashboardLayout>
                    <CalendarPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/reports/weekly"
                element={
                  <DashboardLayout>
                    <WeeklyReportsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/reports/monthly"
                element={
                  <DashboardLayout>
                    <MonthlyReportsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/reports/quarterly"
                element={
                  <DashboardLayout>
                    <QuarterlyReportsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/reports/custom"
                element={
                  <DashboardLayout>
                    <CustomReportsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/management/settings"
                element={
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                }
              />
              {/* Country Lead Routes */}
              <Route
                path="/dashboard/country-lead"
                element={<Navigate to="/dashboard/country-lead/ng" replace />}
              />
              <Route
                path="/dashboard/country-lead/:countryCode"
                element={
                  <DashboardLayout>
                    <CountryLeadDashboard />
                  </DashboardLayout>
                }
              />
                {/* add that for the TrainingViewPage */}
              <Route
                path="/dashboard/country-lead/:countryCode/training"
                element={
                  <DashboardLayout>
                  <AmbassadorTrainingViewPage />
                  </DashboardLayout>
                }
              />

              <Route
                path="/dashboard/country-lead/:countryCode/team"
                element={
                  <DashboardLayout>
                    <TeamPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/pipeline"
                element={
                  <DashboardLayout>
                    <PipelinePage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/events"
                element={
                  <DashboardLayout>
                    <EventsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/resources"
                element={
                  <DashboardLayout>
                    <ResourcesPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/escalations"
                element={
                  <DashboardLayout>
                    <EscalationsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/global"
                element={
                  <DashboardLayout>
                    <GlobalPeekPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/reports"
                element={
                  <DashboardLayout>
                    <ReportsPage />
                  </DashboardLayout>
                }
              />
              {/* Ambassador Routes */}
              <Route
                path="/dashboard/ambassador"
                element={
                  <DashboardLayout>
                    <AmbassadorDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/global"
                element={
                  <DashboardLayout>
                    <GlobalPeekPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/tasks"
                element={
                  <DashboardLayout>
                    <TasksPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/schools"
                element={
                  <DashboardLayout>
                    <AmbassadorSchoolsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/activity"
                element={
                  <DashboardLayout>
                    <ActivityLogPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/resources"
                element={
                  <DashboardLayout>
                    <AmbassadorResourcesPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/impact"
                element={
                  <DashboardLayout>
                    <ImpactPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/support"
                element={
                  <DashboardLayout>
                    <SupportPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/profile"
                element={
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/settings"
                element={
                  <DashboardLayout>
                    <SettingsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/ambassador/training"
                element={
                  <DashboardLayout>
                    <AmbassadorTrainingViewPage />
                  </DashboardLayout>
                }
              />
              {/* Support Routes */}
              <Route
                path="/dashboard/support"
                element={
                  <DashboardLayout>
                    <SupportDashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/global"
                element={
                  <DashboardLayout>
                    <GlobalPeekPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/queues"
                element={
                  <DashboardLayout>
                    <QueuesPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/resources"
                element={
                  <DashboardLayout>
                    <SupportResourcesPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/reports"
                element={
                  <DashboardLayout>
                    <SupportReportsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/moderation"
                element={
                  <DashboardLayout>
                    <ModerationPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/audits"
                element={
                  <DashboardLayout>
                    <AuditsPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/dashboard/support/directory"
                element={
                  <DashboardLayout>
                    <DirectoryPage />
                  </DashboardLayout>
                }
              />
              {/* Help Routes */}
              <Route path="/help/documentation" element={<HelpCenterPage />} />
              <Route path="/help/tutorials" element={<HelpCenterPage />} />
              <Route path="/help/support" element={<HelpCenterPage />} />
            </Routes>
            </Suspense>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
export default App;
