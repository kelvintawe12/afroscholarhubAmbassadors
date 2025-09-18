import React, { useState } from 'react';
import { CalendarIcon, DownloadIcon, FilterIcon, PlusIcon, SettingsIcon, BarChart3Icon, PieChartIcon, FileTextIcon, TrendingUpIcon, UsersIcon, SchoolIcon, MapPinIcon, TargetIcon, SearchIcon, XIcon } from 'lucide-react';
import { LineChart } from '../../../ui/widgets/LineChart';
import { BarChart } from '../../../ui/widgets/BarChart';
import { PieChart } from '../../../ui/widgets/PieChart';
import { DataTable } from '../../../ui/widgets/DataTable';

export const CustomReportsPage = () => {
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedFilters, setSelectedFilters] = useState<{
    dateRange: string;
    countries: string[];
    schools: string[];
    ambassadors: string[];
    metrics: string[];
  }>({
    dateRange: 'last-30-days',
    countries: [],
    schools: [],
    ambassadors: [],
    metrics: ['students', 'partnerships']
  });
  const [reportName, setReportName] = useState('');
  const [savedReports, setSavedReports] = useState([
    { id: 1, name: 'Student Engagement Q1', type: 'Performance', lastRun: '2024-01-15', status: 'completed' },
    { id: 2, name: 'Partnership Growth Analysis', type: 'Growth', lastRun: '2024-01-10', status: 'completed' },
    { id: 3, name: 'Regional Performance', type: 'Geographic', lastRun: '2024-01-08', status: 'completed' }
  ]);

  const availableFilters = {
    countries: ['Nigeria', 'Kenya', 'Ghana', 'South Africa'],
    schools: ['Lagos Model School', 'Nairobi Secondary', 'Accra Academy', 'Cape Town High'],
    ambassadors: ['Aisha Mohammed', 'John Kimani', 'Grace Mensah', 'Samuel Okafor'],
    metrics: ['students', 'partnerships', 'visits', 'engagement', 'growth']
  };

  const reportTemplates = [
    { id: 1, name: 'Student Performance Report', description: 'Detailed analysis of student engagement and outcomes', icon: UsersIcon },
    { id: 2, name: 'Partnership Analysis', description: 'School partnerships and collaboration metrics', icon: SchoolIcon },
    { id: 3, name: 'Regional Overview', description: 'Geographic performance across countries', icon: MapPinIcon },
    { id: 4, name: 'Ambassador Effectiveness', description: 'Individual ambassador performance metrics', icon: TargetIcon },
    { id: 5, name: 'Growth Trends', description: 'Long-term growth and trend analysis', icon: TrendingUpIcon }
  ];

  const customData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Students Reached',
      data: [850, 920, 1100, 1250],
      borderColor: '#1A5F7A',
      backgroundColor: 'rgba(26, 95, 122, 0.1)'
    }]
  };

  const savedReportsColumns = [
    { header: 'Report Name', accessor: 'name' },
    { header: 'Type', accessor: 'type' },
    { header: 'Last Run', accessor: 'lastRun' },
    { header: 'Status', accessor: 'status' }
  ];

  type FilterType = 'countries' | 'schools' | 'ambassadors' | 'metrics';

  const handleFilterChange = (filterType: FilterType, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item: string) => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const generateReport = () => {
    console.log('Generating custom report with filters:', selectedFilters);
    alert('Custom report generated successfully!');
  };

  const saveReport = () => {
    if (reportName.trim()) {
      const newReport = {
        id: savedReports.length + 1,
        name: reportName,
        type: 'Custom',
        lastRun: new Date().toISOString().split('T')[0],
        status: 'completed'
      };
      setSavedReports([...savedReports, newReport]);
      setReportName('');
      alert('Report saved successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
          <p className="text-sm text-gray-500">Build and generate custom reports with advanced filtering</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={generateReport}
            className="flex items-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
          >
            <BarChart3Icon size={16} className="mr-2" />
            Generate Report
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className="flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SettingsIcon size={16} className="mr-2" />
            Report Builder
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'builder', label: 'Report Builder', icon: SettingsIcon },
            { id: 'templates', label: 'Templates', icon: FileTextIcon },
            { id: 'saved', label: 'Saved Reports', icon: BarChart3Icon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center border-b-2 py-2 px-1 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-ash-teal text-ash-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Report Builder Tab */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Filters Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Filters</h3>

              {/* Date Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  value={selectedFilters.dateRange}
                  onChange={(e) => setSelectedFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                >
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-90-days">Last 90 Days</option>
                  <option value="last-6-months">Last 6 Months</option>
                  <option value="last-year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Countries */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Countries</label>
                <div className="space-y-2">
                  {availableFilters.countries.map((country) => (
                    <label key={country} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-ash-teal focus:ring-ash-teal"
                        checked={selectedFilters.countries.includes(country)}
                        onChange={() => handleFilterChange('countries', country)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{country}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
                <div className="space-y-2">
                  {availableFilters.metrics.map((metric) => (
                    <label key={metric} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-ash-teal focus:ring-ash-teal"
                        checked={selectedFilters.metrics.includes(metric)}
                        onChange={() => handleFilterChange('metrics', metric)}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{metric}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Report */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Save Report</label>
                <input
                  type="text"
                  placeholder="Report name"
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm mb-2"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                />
                <button
                  onClick={saveReport}
                  className="w-full flex items-center justify-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
                >
                  <PlusIcon size={16} className="mr-2" />
                  Save Report
                </button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Preview</h3>

              {/* Applied Filters */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Filters:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.countries.map((country) => (
                    <span key={country} className="inline-flex items-center rounded-full bg-ash-teal/10 px-2.5 py-0.5 text-xs font-medium text-ash-teal">
                      {country}
                      <button
                        onClick={() => handleFilterChange('countries', country)}
                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-ash-teal hover:bg-ash-teal hover:text-white"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                  {selectedFilters.metrics.map((metric) => (
                    <span key={metric} className="inline-flex items-center rounded-full bg-ash-gold/10 px-2.5 py-0.5 text-xs font-medium text-ash-gold">
                      {metric}
                      <button
                        onClick={() => handleFilterChange('metrics', metric)}
                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-ash-gold hover:bg-ash-gold hover:text-white"
                      >
                        <XIcon size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Chart */}
              <LineChart
                title="Custom Report Preview"
                data={customData}
              />

              {/* Sample Data Table */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Data:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partnerships</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nigeria</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,250</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kenya</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">650</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reportTemplates.map((template) => (
            <div key={template.id} className="rounded-lg bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
                  <template.icon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              <button className="w-full flex items-center justify-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90">
                Use Template
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Saved Reports Tab */}
      {activeTab === 'saved' && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Saved Reports</h3>
            <button className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <SearchIcon size={16} className="mr-1" />
              Search
            </button>
          </div>
          <DataTable
            columns={savedReportsColumns}
            data={savedReports}
            keyField="id"
            rowsPerPage={10}
          />
        </div>
      )}
    </div>
  );
};
