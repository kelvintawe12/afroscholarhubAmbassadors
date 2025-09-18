import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SearchIcon, BookOpenIcon, PlayCircleIcon, MessageSquareIcon, FileTextIcon, ChevronRightIcon, HelpCircleIcon } from 'lucide-react';
export const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const categories = [{
    id: 'getting-started',
    title: 'Getting Started',
    icon: <BookOpenIcon size={24} className="text-ash-teal" />,
    articles: [{
      id: 1,
      title: 'Creating your account',
      views: 2453
    }, {
      id: 2,
      title: 'Navigating the dashboard',
      views: 1892
    }, {
      id: 3,
      title: 'Understanding your role',
      views: 1654
    }]
  }, {
    id: 'ambassador-guides',
    title: 'Ambassador Guides',
    icon: <FileTextIcon size={24} className="text-ash-gold" />,
    articles: [{
      id: 4,
      title: 'Logging school visits',
      views: 1245
    }, {
      id: 5,
      title: 'Tracking student leads',
      views: 987
    }, {
      id: 6,
      title: 'Managing partnerships',
      views: 876
    }]
  }, {
    id: 'video-tutorials',
    title: 'Video Tutorials',
    icon: <PlayCircleIcon size={24} className="text-green-500" />,
    articles: [{
      id: 7,
      title: 'Dashboard overview',
      views: 2156
    }, {
      id: 8,
      title: 'School visit workflow',
      views: 1765
    }, {
      id: 9,
      title: 'Reporting best practices',
      views: 1432
    }]
  }];
  const faqs = [{
    question: 'How do I reset my password?',
    answer: 'You can reset your password by clicking on the "Forgot password?" link on the login page and following the instructions sent to your email.'
  }, {
    question: 'Can I manage multiple schools?',
    answer: 'Yes, ambassadors can manage multiple schools. You can view all your assigned schools in the "My Schools" section of your dashboard.'
  }, {
    question: 'How do I report a technical issue?',
    answer: 'You can report technical issues by clicking on the chat icon in the bottom right corner of any page or by emailing support@afroscholarhub.org.'
  }, {
    question: 'How often should I update my school visit logs?',
    answer: 'We recommend updating your school visit logs within 24 hours of each visit to ensure accurate reporting and timely follow-ups.'
  }];
  return <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-end">
              <span className="text-3xl font-bold text-ash-teal">ASH</span>
              <span className="ml-1 text-lg font-medium text-ash-dark">
                Nexus
              </span>
            </Link>
            <Link to="/" className="flex items-center text-sm font-medium text-ash-teal hover:text-ash-teal/80">
              <ArrowLeftIcon size={16} className="mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="mb-8 rounded-lg bg-gradient-to-br from-ash-teal to-ash-dark p-8 text-white">
          <h1 className="mb-2 text-3xl font-bold">Help Center</h1>
          <p className="mb-6 max-w-2xl text-white/80">
            Find answers to common questions and learn how to get the most out
            of ASH Nexus
          </p>
          <div className="relative max-w-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon size={20} className="text-gray-400" />
            </div>
            <input type="search" className="w-full rounded-md border-0 bg-white py-3 pl-10 pr-4 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-ash-gold" placeholder="Search for help articles..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        {/* Help categories */}
        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {categories.map(category => <div key={category.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="mr-3">{category.icon}</div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {category.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {category.articles.map(article => <li key={article.id}>
                    <a href="#" className="flex items-center justify-between text-sm hover:text-ash-teal">
                      <span>{article.title}</span>
                      <ChevronRightIcon size={16} />
                    </a>
                    <p className="text-xs text-gray-500">
                      {article.views.toLocaleString()} views
                    </p>
                  </li>)}
              </ul>
              <a href="#" className="mt-4 inline-block text-sm font-medium text-ash-teal hover:text-ash-teal/80">
                View all articles
              </a>
            </div>)}
        </div>
        {/* FAQs */}
        <div className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center">
            <HelpCircleIcon size={24} className="mr-3 text-ash-teal" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <h3 className="font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
              </div>)}
          </div>
          <a href="#" className="mt-6 inline-block text-sm font-medium text-ash-teal hover:text-ash-teal/80">
            View all FAQs
          </a>
        </div>
        {/* Contact support */}
        <div className="rounded-lg bg-gradient-to-r from-ash-gold/20 to-ash-gold/10 p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Still need help?
          </h2>
          <p className="mb-4 text-gray-700">
            Our support team is ready to assist you with any questions
          </p>
          <div className="flex flex-col justify-center space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
            <a href="mailto:support@afroscholarhub.org" className="inline-flex items-center justify-center rounded-md bg-ash-teal px-4 py-2 font-medium text-white hover:bg-ash-teal/90">
              <MessageSquareIcon size={16} className="mr-2" />
              Contact Support
            </a>
            <a href="#" className="inline-flex items-center justify-center rounded-md border border-ash-teal bg-white px-4 py-2 font-medium text-ash-teal hover:bg-ash-teal/10">
              <PlayCircleIcon size={16} className="mr-2" />
              Watch Tutorial
            </a>
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-500">
              © 2025 AfroScholarHub. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-ash-teal">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-ash-teal">
                Privacy
              </Link>
              <Link to="/help" className="text-sm text-gray-500 hover:text-ash-teal">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>;
};