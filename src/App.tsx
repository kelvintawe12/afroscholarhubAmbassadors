import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './components/LoginPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ManagementDashboard } from './components/dashboards/management/ManagementDashboard';
import { CountryLeadDashboard } from './components/dashboards/country-lead/CountryLeadDashboard';
import { AmbassadorDashboard } from './components/dashboards/ambassador/AmbassadorDashboard';
import { AmbassadorsPage } from './components/dashboards/management/ambassadors/AmbassadorsPage';
import { AmbassadorPerformancePage } from './components/dashboards/management/ambassadors/PerformancePage';
import { AmbassadorTrainingPage } from './components/dashboards/management/ambassadors/TrainingPage';
import { SchoolsPage } from './components/dashboards/management/schools/SchoolsPage';
import { SchoolProspectsPage } from './components/dashboards/management/schools/ProspectsPage';
import { OutreachEventsPage } from './components/dashboards/management/outreaches/EventsPage';
import { OutreachPipelinePage } from './components/dashboards/management/outreaches/PipelinePage';
import { WeeklyReportsPage } from './components/dashboards/management/reports/WeeklyReportsPage';
import { SettingsPage } from './components/dashboards/management/SettingsPage';
function App() {
  return <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Management Routes */}
        <Route path="/dashboard/management" element={<DashboardLayout>
              <ManagementDashboard />
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
        <Route path="/dashboard/management/outreaches/events" element={<DashboardLayout>
              <OutreachEventsPage />
            </DashboardLayout>} />
        <Route path="/dashboard/management/outreaches/pipeline" element={<DashboardLayout>
              <OutreachPipelinePage />
            </DashboardLayout>} />
        <Route path="/dashboard/management/reports/weekly" element={<DashboardLayout>
              <WeeklyReportsPage />
            </DashboardLayout>} />
        <Route path="/dashboard/management/settings" element={<DashboardLayout>
              <SettingsPage />
            </DashboardLayout>} />
        {/* Country Lead Routes */}
        <Route path="/dashboard/country-lead/:countryCode" element={<DashboardLayout>
              <CountryLeadDashboard />
            </DashboardLayout>} />
        {/* Ambassador Routes */}
        <Route path="/dashboard/ambassador" element={<DashboardLayout>
              <AmbassadorDashboard />
            </DashboardLayout>} />
      </Routes>
    </Router>;
}
export default App;