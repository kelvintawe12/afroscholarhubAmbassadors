import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Video, 
  Users, 
  FileText, 
  Folder, 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  MessageSquare,
  Shield,
  Zap,
  Award,
  MapPin,
  Phone,
  Mail,
  Plus,
  Heart
} from 'lucide-react';
import { DataTable } from '../../ui/widgets/DataTable';

// Types
interface Resource {
  id: string;
  title: string;
  category: 'training' | 'templates' | 'guides' | 'videos' | 'toolkits' | 'legal' | 'marketing' | 'reports';
  type: 'pdf' | 'video' | 'doc' | 'zip' | 'ppt' | 'html';
  format: string;
  size: string;
  updated: string;
  downloads: number;
  rating: number;
  countrySpecific: boolean;
  countries: string[];
  description: string;
  featured: boolean;
  tags: string[];
}

interface ResourceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  description: string;
}

// Mock Data
const resourceCategories: ResourceCategory[] = [
  {
    id: 'training',
    title: 'Training Materials',
    icon: <BookOpen className="h-8 w-8" />,
    count: 23,
    color: 'from-blue-500 to-blue-600',
    description: 'Onboarding, certification, and skill development modules'
  },
  {
    id: 'templates',
    title: 'Templates & Forms',
    icon: <FileText className="h-8 w-8" />,
    count: 18,
    color: 'from-green-500 to-emerald-600',
    description: 'Applications, agreements, and reporting templates'
  },
  {
    id: 'guides',
    title: 'Guides & Manuals',
    icon: <BookOpen className="h-8 w-8" />,
    count: 12,
    color: 'from-purple-500 to-violet-600',
    description: 'Step-by-step guides for scholarship processes'
  },
  {
    id: 'videos',
    title: 'Video Tutorials',
    icon: <Video className="h-8 w-8" />,
    count: 8,
    color: 'from-yellow-400 to-orange-500',
    description: 'Training videos and best practice demonstrations'
  },
  {
    id: 'toolkits',
    title: 'Toolkits & Resources',
    icon: <Folder className="h-8 w-8" />,
    count: 15,
    color: 'from-red-500 to-pink-500',
    description: 'Complete kits for events, workshops, and campaigns'
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    icon: <Shield className="h-8 w-8" />,
    count: 6,
    color: 'from-gray-500 to-gray-600',
    description: 'Contracts, policies, and regulatory documents'
  },
  {
    id: 'marketing',
    title: 'Marketing Materials',
    icon: <Zap className="h-8 w-8" />,
    count: 21,
    color: 'from-indigo-500 to-cyan-500',
    description: 'Posters, flyers, and promotional materials'
  },
  {
    id: 'reports',
    title: 'Reporting Templates',
    icon: <Award className="h-8 w-8" />,
    count: 9,
    color: 'from-teal-500 to-emerald-600',
    description: 'Impact reports and performance tracking'
  }
];

const featuredResources: Resource[] = [
  {
    id: '1',
    title: 'Ambassador Onboarding Toolkit 2024',
    category: 'toolkits',
    type: 'zip',
    format: 'ZIP',
    size: '12.4MB',
    updated: 'Dec 15, 2024',
    downloads: 1234,
    rating: 4.8,
    countrySpecific: false,
    countries: [],
    description: 'Complete onboarding package with training modules, templates, and certification materials for new ambassadors',
    featured: true,
    tags: ['onboarding', 'training', 'certification']
  },
  {
    id: '2',
    title: 'STEM Scholarship Application Template',
    category: 'templates',
    type: 'doc',
    format: 'DOCX',
    size: '245KB',
    updated: 'Dec 10, 2024',
    downloads: 856,
    rating: 4.9,
    countrySpecific: true,
    countries: ['NG', 'GH', 'KE'],
    description: 'Standardized application form for STEM excellence scholarships with country-specific requirements',
    featured: true,
    tags: ['stem', 'application', 'template']
  },
  {
    id: '3',
    title: 'School Partnership Agreement',
    category: 'legal',
    type: 'pdf',
    format: 'PDF',
    size: '1.2MB',
    updated: 'Dec 8, 2024',
    downloads: 423,
    rating: 4.7,
    countrySpecific: true,
    countries: ['NG', 'GH', 'ZA'],
    description: 'Legal agreement template for formal school partnerships with compliance clauses',
    featured: true,
    tags: ['legal', 'partnership', 'contract']
  },
  {
    id: '4',
    title: 'Workshop Facilitation Guide',
    category: 'guides',
    type: 'pdf',
    format: 'PDF',
    size: '3.8MB',
    updated: 'Dec 12, 2024',
    downloads: 678,
    rating: 4.6,
    countrySpecific: false,
    countries: [],
    description: 'Step-by-step guide for conducting scholarship workshops and career guidance sessions',
    featured: true,
    tags: ['workshop', 'facilitation', 'guide']
  },
  {
    id: '5',
    title: 'Nigeria Marketing Kit Q4 2024',
    category: 'marketing',
    type: 'zip',
    format: 'ZIP',
    size: '8.9MB',
    updated: 'Dec 14, 2024',
    downloads: 156,
    rating: 4.5,
    countrySpecific: true,
    countries: ['NG'],
    description: 'Complete marketing package with posters, flyers, and social media assets for Nigeria operations',
    featured: true,
    tags: ['marketing', 'nigeria', 'q4']
  }
];

const allResources: Resource[] = [
  ...featuredResources,
  {
    id: '6',
    title: 'Monthly Impact Report Template',
    category: 'reports',
    type: 'ppt',
    format: 'PPTX',
    size: '2.1MB',
    updated: 'Dec 5, 2024',
    downloads: 234,
    rating: 4.4,
    countrySpecific: false,
    countries: [],
    description: 'PowerPoint template for monthly ambassador impact reporting',
    featured: false,
    tags: ['reporting', 'template', 'monthly']
  },
  {
    id: '7',
    title: 'KYC Compliance Checklist',
    category: 'legal',
    type: 'pdf',
    format: 'PDF',
    size: '189KB',
    updated: 'Nov 28, 2024',
    downloads: 345,
    rating: 4.3,
    countrySpecific: true,
    countries: ['NG', 'GH', 'KE'],
    description: 'Checklist for student KYC documentation and compliance requirements',
    featured: false,
    tags: ['compliance', 'kyc', 'checklist']
  },
  {
    id: '8',
    title: 'Social Media Content Calendar',
    category: 'marketing',
    type: 'doc',
    format: 'DOCX',
    size: '156KB',
    updated: 'Dec 3, 2024',
    downloads: 567,
    rating: 4.6,
    countrySpecific: false,
    countries: [],
    description: '30-day content calendar for scholarship promotion on social media',
    featured: false,
    tags: ['social', 'calendar', 'marketing']
  },
  {
    id: '9',
    title: 'Virtual Workshop Best Practices',
    category: 'videos',
    type: 'video',
    format: 'MP4',
    size: '45.2MB',
    updated: 'Dec 7, 2024',
    downloads: 123,
    rating: 4.7,
    countrySpecific: false,
    countries: [],
    description: '15-minute video tutorial on conducting effective virtual workshops',
    featured: false,
    tags: ['video', 'virtual', 'workshop']
  },
  {
    id: '10',
    title: 'Ghana Scholarship Flyer Template',
    category: 'marketing',
    type: 'pdf',
    format: 'PDF',
    size: '1.8MB',
    updated: 'Dec 11, 2024',
    downloads: 89,
    rating: 4.8,
    countrySpecific: true,
    countries: ['GH'],
    description: 'Customizable flyer template for Ghana scholarship campaigns',
    featured: false,
    tags: ['ghana', 'flyer', 'marketing']
  }
];

// Components
const ResourceCard: React.FC<{ resource: Resource; onDownload: () => void; onPreview?: () => void }> = ({ 
  resource, 
  onDownload, 
  onPreview 
}) => {
  const getTypeIcon = (type: string) => {
    const icons = {
      pdf: <FileText className="h-4 w-4 text-red-500" />,
      video: <Video className="h-4 w-4 text-purple-500" />,
      doc: <FileText className="h-4 w-4 text-blue-500" />,
      zip: <Folder className="h-4 w-4 text-gray-500" />,
      ppt: <FileText className="h-4 w-4 text-orange-500" />,
      html: <FileText className="h-4 w-4 text-green-500" />
    };
    return icons[type as keyof typeof icons] || <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-3 w-3 text-yellow-400 fill-current" />
        ))}
        {hasHalfStar && <Star className="h-3 w-3 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-gray-300" />
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  const countryBadges = resource.countries.slice(0, 2).map(country => (
    <span key={country} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
      {country === 'NG' ? '🇳🇬' : country === 'GH' ? '🇬🇭' : country === 'KE' ? '🇰🇪' : country === 'ZA' ? '🇿🇦' : '🌍'}
    </span>
  ));

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Featured Badge */}
      {resource.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-ash-teal to-ash-gold text-white shadow-sm">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </span>
        </div>
      )}

      {/* Country Specific Badge */}
      {resource.countrySpecific && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {resource.countries.length === 1 ? resource.countries[0] : `${resource.countries.length} Countries`}
          </span>
        </div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-ash-teal transition-colors">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{resource.description}</p>
          </div>
          
          {/* File Type */}
          <div className="flex-shrink-0 ml-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
              {getTypeIcon(resource.type)}
              <span>{resource.format}</span>
            </div>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              {resource.downloads} downloads
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(resource.updated).toLocaleDateString()}
            </span>
            <span>{resource.size}</span>
          </div>
          
          {/* Rating */}
          {getStars(resource.rating)}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {resource.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
          )}
        </div>

        {/* Country Badges */}
        {resource.countrySpecific && (
          <div className="mb-4 flex flex-wrap gap-1">
            {countryBadges}
            {resource.countries.length > 2 && (
              <span className="text-xs text-gray-500">+{resource.countries.length - 2} more</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
          {onPreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-ash-teal bg-ash-teal/5 rounded-lg hover:bg-ash-teal/10 transition-colors"
            >
              <Zap className="h-3 w-3" />
              Preview
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-ash-teal to-ash-gold rounded-lg hover:from-ash-teal/90 hover:to-ash-gold/90 transition-all shadow-sm"
          >
            <Download className="h-3 w-3" />
            Download
          </button>
          
          {/* Favorite Button */}
          <button className="ml-auto p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Heart className={`h-4 w-4 ${resource.featured ? 'fill-current text-red-500' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CategoryCard: React.FC<{ category: ResourceCategory; onClick: () => void; isActive: boolean }> = ({ 
  category, 
  onClick, 
  isActive 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden
        ${isActive 
          ? 'border-ash-teal bg-gradient-to-br from-ash-teal/5 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      <div className="relative z-10 flex flex-col items-center space-y-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} flex-shrink-0`}>
          {category.icon}
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.title}</h3>
          <p className="text-sm text-gray-600">{category.description}</p>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
          <span>{category.count}</span>
          <span className="text-gray-400">resources</span>
        </div>
      </div>
    </button>
  );
};

const QuickLink: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  url: string;
  color?: string;
}> = ({ icon, title, description, url, color = 'from-ash-teal to-ash-gold' }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity`} />
      
      <div className="relative z-10 flex items-start space-x-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-ash-teal transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <svg className="h-4 w-4 text-gray-400 group-hover:text-ash-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  );
};

const ResourcesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    country: 'all',
    type: 'all',
    rating: 'all'
  });

  const countries = [
    { value: 'all', label: 'All Countries' },
    { value: 'NG', label: 'Nigeria 🇳🇬' },
    { value: 'GH', label: 'Ghana 🇬🇭' },
    { value: 'KE', label: 'Kenya 🇰🇪' },
    { value: 'ZA', label: 'South Africa 🇿🇦' },
    { value: 'UG', label: 'Uganda 🇺🇬' },
    { value: 'EG', label: 'Egypt 🇪🇬' },
    { value: 'multi', label: 'Multi-country 🌍' }
  ];

  const resourceTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'video', label: 'Video Tutorials' },
    { value: 'doc', label: 'Word Documents' },
    { value: 'zip', label: 'Resource Kits' },
    { value: 'ppt', label: 'Presentations' }
  ];

  // Filter resources
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory;
    const matchesCountry = filters.country === 'all' || 
                          !resource.countrySpecific || 
                          resource.countries.includes(filters.country) ||
                          (filters.country === 'multi' && !resource.countrySpecific);
    const matchesType = filters.type === 'all' || resource.type === filters.type;
    const matchesRating = filters.rating === 'all' || resource.rating >= (filters.rating === '4+' ? 4 : 0);
    
    return matchesSearch && matchesCategory && matchesCountry && matchesType && matchesRating;
  });

  // Quick links for ambassadors
  const quickLinks = [
    {
      icon: <Phone className="h-5 w-5" />,
      title: 'Country Support Line',
      description: '24/7 support for operational issues',
      url: 'tel:+2348012345678',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: 'Submit Feedback',
      description: 'Share your suggestions and improvements',
      url: 'mailto:support@afroscholarhub.org',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: 'Community Forum',
      description: 'Connect with other ambassadors',
      url: 'https://community.afroscholarhub.org',
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: 'Training Calendar',
      description: 'Upcoming webinars and workshops',
      url: '/training-schedule',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-ash-teal to-ash-gold text-white rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Ambassador Resource Hub</h1>
          <p className="text-xl mb-6 text-ash-light">
            Everything you need to succeed as an Afroscholarhub ambassador
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
              <Shield className="h-4 w-4" />
              100% Compliance Ready
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
              <Download className="h-4 w-4" />
              2,847 Downloads This Month
            </div>
            <div className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
              <Star className="h-4 w-4" />
              4.8 Average Rating
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link, index) => (
          <QuickLink 
            key={index}
            {...link}
          />
        ))}
      </div>

      {/* Featured Resources */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Star className="h-6 w-6 mr-2 text-yellow-500" />
            Featured Resources
          </h2>
          <span className="text-sm text-gray-500">Most downloaded this month</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredResources.map((resource) => (
            <ResourceCard 
              key={resource.id}
              resource={resource}
              onDownload={() => console.log('Download:', resource.title)}
              onPreview={() => console.log('Preview:', resource.title)}
            />
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`
              group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden
              ${activeCategory === 'all' 
                ? 'border-ash-teal bg-gradient-to-br from-ash-teal/5 shadow-md' 
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }
            `}
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex-shrink-0 mb-3`}>
              <Folder className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 text-center">All Resources</h3>
            <p className="text-sm text-gray-600 text-center mb-3">Everything in one place</p>
            <div className="text-sm font-medium text-gray-700">
              {allResources.length} total
            </div>
          </button>
          
          {resourceCategories.map((category) => (
            <CategoryCard 
              key={category.id}
              category={category}
              onClick={() => setActiveCategory(category.id)}
              isActive={activeCategory === category.id}
            />
          ))}
        </div>
      </div>

      {/* Main Resources Grid */}
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources, guides, or templates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ash-teal focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                <Filter className="h-4 w-4 text-gray-500 mr-2" />
                <select
                  className="bg-transparent text-sm border-none focus:outline-none"
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                >
                  {countries.map(country => (
                    <option key={country.value} value={country.value}>{country.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                <select
                  className="bg-transparent text-sm border-none focus:outline-none"
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                >
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                <select
                  className="bg-transparent text-sm border-none focus:outline-none"
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                >
                  <option value="all">All Ratings</option>
                  <option value="4+">4+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="space-y-6">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard 
                  key={resource.id}
                  resource={resource}
                  onDownload={() => console.log('Download:', resource.title)}
                  onPreview={() => console.log('Preview:', resource.title)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <button className="flex items-center gap-2 px-4 py-2 bg-ash-teal text-white rounded-lg font-medium hover:bg-ash-teal/90 transition-colors mx-auto">
                <Plus className="h-4 w-4" />
                Request New Resource
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Resources Table View - Alternative */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">All Resources (Table View)</h3>
          <button className="text-sm text-ash-teal hover:text-ash-teal/80 font-medium">
            Switch to Grid View →
          </button>
        </div>
        <DataTable 
          columns={[
            { 
              header: 'Resource', 
              accessor: (row: Resource) => (
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <FileText className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{row.title}</div>
                    <div className="text-xs text-gray-500 truncate">{row.description}</div>
                  </div>
                </div>
              )
            },
            { 
              header: 'Category', 
              accessor: (row: Resource) => (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  {row.category}
                </span>
              )
            },
            { 
              header: 'Type', 
              accessor: (row: Resource) => row.format 
            },
            { 
              header: 'Updated', 
              accessor: (row: Resource) => new Date(row.updated).toLocaleDateString(),
              sortable: true
            },
            { 
              header: 'Downloads', 
              accessor: (row: Resource) => row.downloads.toLocaleString(),
              sortable: true
            },
            { 
              header: 'Rating', 
              accessor: (row: Resource) => (
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm font-medium">{row.rating}</span>
                </div>
              )
            },
            { 
              header: 'Actions', 
              accessor: (row: Resource) => (
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-ash-teal hover:bg-ash-teal/10 rounded transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </div>
              )
            }
          ]}
          data={allResources}
          keyField="id"
          rowsPerPage={10}
        />
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-ash-teal to-ash-gold text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 md:hidden">
        <Plus className="h-6 w-6" />
      </div>
    </div>
  );
};

export default ResourcesPage;