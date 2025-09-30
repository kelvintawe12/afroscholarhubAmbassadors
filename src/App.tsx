import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoadingSpinner } from './components/LoadingSpinner';

// Lazy load all components for code splitting
const LoginPage = React.lazy(() => import('./components/LoginPage').then(module => ({ default: module.LoginPage })));
const SignUpPage = React.lazy(() => import('./components/SignUpPage').then(module => ({ default: module.SignUpPage })));
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

// Country Lead Training Component
const CountryLeadTrainingViewPage = React.lazy(() => import('./components/dashboards/country-lead/Training').then(module => ({ default: module.default })));

// Management Ambassador Components
const AmbassadorsPage = React.lazy(() => import('./components/dashboards/management/ambassadors/AmbassadorsPage').then(module => ({ default: module.default })));
const AmbassadorPerformancePage = React.lazy(() => import('./components/dashboards/management/ambassadors/PerformancePage').then(module => ({ default: module.AmbassadorPerformancePage })));
const AmbassadorTrainingPage = React.lazy(() => import('./components/dashboards/management/ambassadors/TrainingPage').then(module => ({ default: module.AmbassadorTrainingPage })));

// Management Users Components
const UsersPage = React.lazy(() => import('./components/dashboards/management/users/UsersPage').then(module => ({ default: module.default })));

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

// Auth Components
const AuthCallback = React.lazy(() => import('./components/AuthCallback').then(module => ({ default: module.default })));
const ForgotPasswordPage = React.lazy(() => import('./components/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import('./components/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const ReauthPage = React.lazy(() => import('./components/ReauthPage').then(module => ({ default: module.ReauthPage })));

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
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reauth" element={<ReauthPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              {/* Management Routes */}
              <Route
                path="/dashboard/management"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <ManagementDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/global"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <GlobalPeekPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/analytics"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <AnalyticsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/insights"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <InsightsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/ambassadors"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <AmbassadorsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/ambassadors/performance"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <AmbassadorPerformancePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/ambassadors/training"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <AmbassadorTrainingPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/users"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <UsersPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/schools"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <SchoolsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/schools/prospects"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <SchoolProspectsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/schools/partnerships"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <SchoolPartnershipsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/outreaches/events"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <OutreachEventsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/outreaches/events/new"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <EventCreatePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/outreaches/events/:id/edit"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <EventEditPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/outreaches/pipeline"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <OutreachPipelinePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/outreaches/calendar"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <CalendarPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/reports/weekly"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <WeeklyReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/reports/monthly"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <MonthlyReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/reports/quarterly"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <QuarterlyReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/reports/custom"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <CustomReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/management/settings"
                element={
                  <ProtectedRoute requiredRole="management">
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
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
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <CountryLeadDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                {/* add that for the TrainingViewPage */}
              <Route
                path="/dashboard/country-lead/:countryCode/training"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                    <CountryLeadTrainingViewPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/country-lead/:countryCode/team"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <TeamPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/pipeline"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <PipelinePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/events"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <EventsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/resources"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <ResourcesPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/escalations"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <EscalationsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/global"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <GlobalPeekPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/country-lead/:countryCode/reports"
                element={
                  <ProtectedRoute requiredRole="country_lead">
                    <DashboardLayout>
                      <ReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              {/* Ambassador Routes */}
              <Route
                path="/dashboard/ambassador"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <AmbassadorDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/global"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <GlobalPeekPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/tasks"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <TasksPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/schools"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <AmbassadorSchoolsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/activity"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <ActivityLogPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/resources"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <AmbassadorResourcesPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/impact"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <ImpactPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/support"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <SupportPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/profile"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <ProfilePage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/settings"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <SettingsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/ambassador/training"
                element={
                  <ProtectedRoute requiredRole="ambassador">
                    <DashboardLayout>
                      <AmbassadorTrainingViewPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              {/* Support Routes */}
              <Route
                path="/dashboard/support"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <SupportDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/global"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <GlobalPeekPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/queues"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <QueuesPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/resources"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <SupportResourcesPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/reports"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <SupportReportsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/moderation"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <ModerationPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/audits"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <AuditsPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/support/directory"
                element={
                  <ProtectedRoute requiredRole="support">
                    <DashboardLayout>
                      <DirectoryPage />
                    </DashboardLayout>
                  </ProtectedRoute>
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
