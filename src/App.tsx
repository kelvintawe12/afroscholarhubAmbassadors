import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { ManagementDashboard } from './components/dashboards/management/ManagementDashboard';
import { AnalyticsPage } from './components/dashboards/management/AnalyticsPage';
import { InsightsPage } from './components/dashboards/management/InsightsPage';
import { CountryLeadDashboard } from './components/dashboards/country-lead/CountryLeadDashboard';
import { TeamPage } from './components/dashboards/country-lead/TeamPage';
import PipelinePage from './components/dashboards/country-lead/PipelinePage';
import  EventsPage  from './components/dashboards/country-lead/EventsPage';
import  ResourcesPage  from './components/dashboards/country-lead/ResourcesPage';
import  EscalationsPage  from './components/dashboards/country-lead/EscalationsPage';
import  GlobalPeekPage  from './components/dashboards/country-lead/GlobalPeekPage';
import  ReportsPage  from './components/dashboards/country-lead/ReportsPage';
import { AmbassadorDashboard } from './components/dashboards/ambassador/AmbassadorDashboard';
import { TasksPage } from './components/dashboards/ambassador/TasksPage';
import { AmbassadorSchoolsPage } from './components/dashboards/ambassador/SchoolsPage';
import { ActivityLogPage } from './components/dashboards/ambassador/ActivityLogPage';
import { AmbassadorResourcesPage } from './components/dashboards/ambassador/ResourcesPage';
import { ImpactPage } from './components/dashboards/ambassador/ImpactPage';
import { SupportPage } from './components/dashboards/ambassador/SupportPage';
import  AmbassadorsPage  from './components/dashboards/management/ambassadors/AmbassadorsPage';
import { AmbassadorPerformancePage } from './components/dashboards/management/ambassadors/PerformancePage';
import { AmbassadorTrainingPage } from './components/dashboards/management/ambassadors/TrainingPage';
import { SchoolsPage } from './components/dashboards/management/schools/SchoolsPage';
import { SchoolProspectsPage } from './components/dashboards/management/schools/ProspectsPage';
import { SchoolPartnershipsPage } from './components/dashboards/management/schools/PartnershipsPage';
import { OutreachEventsPage } from './components/dashboards/management/outreaches/EventsPage';
import { OutreachPipelinePage } from './components/dashboards/management/outreaches/PipelinePage';
import { CalendarPage } from './components/dashboards/management/outreaches/CalendarPage';
import { WeeklyReportsPage } from './components/dashboards/management/reports/WeeklyReportsPage';
import { MonthlyReportsPage } from './components/dashboards/management/reports/MonthlyReportsPage';
import { QuarterlyReportsPage } from './components/dashboards/management/reports/QuarterlyReportsPage';
import { CustomReportsPage } from './components/dashboards/management/reports/CustomReportsPage';
import { SettingsPage } from './components/dashboards/management/SettingsPage';
import { PlaceholderPage } from './components/shared/PlaceholderPage';
import { QueuesPage } from './components/dashboards/support/QueuesPage';
import { SupportResourcesPage } from './components/dashboards/support/ResourcesPage';
import { SupportReportsPage } from './components/dashboards/support/ReportsPage';
import { ModerationPage } from './components/dashboards/support/ModerationPage';
import { AuditsPage } from './components/dashboards/support/AuditsPage';
import { DirectoryPage } from './components/dashboards/support/DirectoryPage';
import { SupportDashboard } from './components/dashboards/support/SupportDashboard';
function App() {
  return (
    <>
      <PWAInstallPrompt />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Management Routes */}
          <Route path="/dashboard/management" element={<DashboardLayout>
                <ManagementDashboard />
              </DashboardLayout>} />
          <Route path="/dashboard/management/analytics" element={<DashboardLayout>
                <AnalyticsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/insights" element={<DashboardLayout>
                <InsightsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/ambassadors" element={<DashboardLayout>
                <AmbassadorsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/ambassadors/performance" element={<DashboardLayout>
                <AmbassadorPerformancePage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/ambassadors/training" element={<DashboardLayout>
                <AmbassadorTrainingPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/schools" element={<DashboardLayout>
                <SchoolsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/schools/prospects" element={<DashboardLayout>
                <SchoolProspectsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/schools/partnerships" element={<DashboardLayout>
                <SchoolPartnershipsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/outreaches/events" element={<DashboardLayout>
                <OutreachEventsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/outreaches/pipeline" element={<DashboardLayout>
                <OutreachPipelinePage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/outreaches/calendar" element={<DashboardLayout>
                <CalendarPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/reports/weekly" element={<DashboardLayout>
                <WeeklyReportsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/reports/monthly" element={<DashboardLayout>
                <MonthlyReportsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/reports/quarterly" element={<DashboardLayout>
                <QuarterlyReportsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/reports/custom" element={<DashboardLayout>
                <CustomReportsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/management/settings" element={<DashboardLayout>
                <SettingsPage />
              </DashboardLayout>} />
          {/* Country Lead Routes */}
          <Route path="/dashboard/country-lead" element={<Navigate to="/dashboard/country-lead/ng" replace />} />
          <Route path="/dashboard/country-lead/:countryCode" element={<DashboardLayout>
                <CountryLeadDashboard />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/team" element={<DashboardLayout>
                <TeamPage />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/pipeline" element={<DashboardLayout>
                <PipelinePage />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/events" element={<DashboardLayout>
                <EventsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/resources" element={<DashboardLayout>
                <ResourcesPage />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/escalations" element={<DashboardLayout>
                <EscalationsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/global" element={<DashboardLayout>
                <GlobalPeekPage />
              </DashboardLayout>} />
          <Route path="/dashboard/country-lead/:countryCode/reports" element={<DashboardLayout>
                <ReportsPage />
              </DashboardLayout>} />
          {/* Ambassador Routes */}
          <Route path="/dashboard/ambassador" element={<DashboardLayout>
                <AmbassadorDashboard />
              </DashboardLayout>} />
          <Route path="/dashboard/ambassador/tasks" element={<DashboardLayout>
                <TasksPage />
              </DashboardLayout>} />
          <Route path="/dashboard/ambassador/schools" element={<DashboardLayout>
                <AmbassadorSchoolsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/ambassador/activity" element={<DashboardLayout>
                <ActivityLogPage />
              </DashboardLayout>} />
          <Route path="/dashboard/ambassador/resources" element={<DashboardLayout>
                <AmbassadorResourcesPage />
              </DashboardLayout>} />
          <Route path="/dashboard/ambassador/impact" element={<DashboardLayout>
                <ImpactPage />
              </DashboardLayout>} />
          <Route path="/dashboard/ambassador/support" element={<DashboardLayout>
                <SupportPage />
              </DashboardLayout>} />
          {/* Support Routes */}
          <Route path="/dashboard/support" element={<DashboardLayout>
                <SupportDashboard />
              </DashboardLayout>} />
          <Route path="/dashboard/support/queues" element={<DashboardLayout>
                <QueuesPage />
              </DashboardLayout>} />
          <Route path="/dashboard/support/resources" element={<DashboardLayout>
                <SupportResourcesPage />
              </DashboardLayout>} />
          <Route path="/dashboard/support/reports" element={<DashboardLayout>
                <SupportReportsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/support/moderation" element={<DashboardLayout>
                <ModerationPage />
              </DashboardLayout>} />
          <Route path="/dashboard/support/audits" element={<DashboardLayout>
                <AuditsPage />
              </DashboardLayout>} />
          <Route path="/dashboard/support/directory" element={<DashboardLayout>
                <DirectoryPage />
              </DashboardLayout>} />
        </Routes>
      </Router>
    </>
  );
}
export default App;