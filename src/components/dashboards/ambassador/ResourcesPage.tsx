import React, { useState, useEffect } from 'react';
import { DownloadIcon, FileTextIcon, VideoIcon, ImageIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { getResources } from '../../../api/ambassador';
import { useAuth } from '../../../hooks/useAuth';

export const AmbassadorResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchResources = async () => {
      if (!user?.id) return;
      try {
        setIsLoading(true);
        const data = await getResources(user.id);
        setResources(data.length > 0 ? data : mockResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources(mockResources);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, [user?.id]);

  // Mock resources data (fallback if no real data)
  const mockResources = [
    {
      id: 1,
      title: 'Partnership Pitch Deck',
      description: 'Comprehensive presentation template for school partnerships',
      type: 'PDF',
      category: 'Presentation',
      size: '2.5 MB',
      downloadUrl: '#',
      icon: <FileTextIcon size={24} />
    },
    {
      id: 2,
      title: 'Branded Flyer Template',
      description: 'Customizable flyer template for school visits',
      type: 'DOCX',
      category: 'Marketing',
      size: '1.2 MB',
      downloadUrl: '#',
      icon: <ImageIcon size={24} />
    },
    {
      id: 3,
      title: '5-Minute Essay Workshop',
      description: 'Video tutorial on conducting effective essay workshops',
      type: 'VIDEO',
      category: 'Training',
      size: '45 MB',
      downloadUrl: '#',
      icon: <VideoIcon size={24} />
    },
    {
      id: 4,
      title: 'Scholarship Application Guide',
      description: 'Step-by-step guide for students applying to scholarships',
      type: 'PDF',
      category: 'Guide',
      size: '1.8 MB',
      downloadUrl: '#',
      icon: <FileTextIcon size={24} />
    },
    {
      id: 5,
      title: 'School Visit Checklist',
      description: 'Comprehensive checklist for successful school visits',
      type: 'PDF',
      category: 'Checklist',
      size: '0.8 MB',
      downloadUrl: '#',
      icon: <FileTextIcon size={24} />
    },
    {
      id: 6,
      title: 'Student Engagement Strategies',
      description: 'Video series on engaging students in scholarship programs',
      type: 'VIDEO',
      category: 'Training',
      size: '120 MB',
      downloadUrl: '#',
      icon: <VideoIcon size={24} />
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || resource.category.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDownload = (resource: any) => {
    // In a real app, this would trigger the actual download
    console.log(`Downloading ${resource.title}`);
    // For demo purposes, show an alert
    alert(`Downloading ${resource.title}...`);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'DOCX': return 'bg-blue-100 text-blue-800';
      case 'VIDEO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        <p className="text-sm text-gray-500">
          Access downloadable materials, templates, and training resources
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'all' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('all')}
          >
            All Resources
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'presentation' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('presentation')}
          >
            Presentations
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'training' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('training')}
          >
            Training
          </button>
          <button
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              filterType === 'marketing' ? 'bg-ash-teal text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setFilterType('marketing')}
          >
            Marketing
          </button>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={16} className="text-gray-400" />
            </div>
            <input
              type="search"
              placeholder="Search resources..."
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map(resource => (
          <div key={resource.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
                {resource.icon}
              </div>
              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getTypeColor(resource.type)}`}>
                {resource.type}
              </span>
            </div>

            <h3 className="mb-2 text-lg font-medium text-gray-900">
              {resource.title}
            </h3>

            <p className="mb-3 text-sm text-gray-600">
              {resource.description}
            </p>

            <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
              <span>{resource.category}</span>
              <span>{resource.size}</span>
            </div>

            <button
              onClick={() => handleDownload(resource)}
              className="flex w-full items-center justify-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90"
            >
              <DownloadIcon size={16} className="mr-2" />
              Download
            </button>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
          <FileTextIcon size={48} className="mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">No resources found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery || filterType !== 'all' ? 'Try adjusting your search or filters' : 'No resources available'}
          </p>
          {(searchQuery || filterType !== 'all') && (
            <button
              className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setSearchQuery('');
                setFilterType('all');
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-base font-medium text-gray-900">Resource Stats</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-ash-teal">{resources.length}</div>
            <div className="text-sm text-gray-500">Total Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {resources.filter(r => r.type === 'VIDEO').length}
            </div>
            <div className="text-sm text-gray-500">Video Tutorials</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.type === 'PDF').length}
            </div>
            <div className="text-sm text-gray-500">Documents</div>
          </div>
        </div>
      </div>
    </div>
  );
};
