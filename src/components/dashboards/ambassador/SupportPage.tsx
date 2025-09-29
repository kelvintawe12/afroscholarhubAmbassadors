import React, { useState } from 'react';
import { HelpCircleIcon, MessageSquareIcon, PhoneIcon, MailIcon, ChevronDownIcon, ChevronUpIcon, SendIcon } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { createSupportTicket } from '../../../api/support';

export const SupportPage = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  const faqs = [
    {
      id: 1,
      question: 'How do I schedule a school visit?',
      answer: 'To schedule a school visit, go to the Schools page and click on "Schedule Visit" for any assigned school. You can also use the quick action button in the dashboard.'
    },
    {
      id: 2,
      question: 'What should I include in my visit reports?',
      answer: 'Visit reports should include: number of students reached, activities conducted, feedback received, photos (if available), and any follow-up actions needed.'
    },
    {
      id: 3,
      question: 'How do I update school contact information?',
      answer: 'You can update school contact information by going to the Schools page, selecting a school, and clicking the "Edit" button. Make sure to verify all information before saving.'
    },
    {
      id: 4,
      question: 'What resources are available for school presentations?',
      answer: 'Check the Resources page for presentation templates, branded materials, and training videos. You can download and customize these for your school visits.'
    },
    {
      id: 5,
      question: 'How do I log activities and track my progress?',
      answer: 'Use the "Quick Log Activity" button on the dashboard or go to the Tasks page to create and update tasks. Regular activity logging helps track your impact metrics.'
    },
    {
      id: 6,
      question: 'Who do I contact for technical issues?',
      answer: 'For technical issues with the platform, use the contact form below or email support@afroscholarhub.org. For program-related questions, contact your country lead.'
    }
  ];

  const contactMethods = [
    {
      icon: <MailIcon size={20} />,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@afroscholarhub.org',
      action: 'mailto:support@afroscholarhub.org'
    },
    {
      icon: <PhoneIcon size={20} />,
      title: 'Phone Support',
      description: 'Call for urgent issues',
      contact: '+234 801 234 5678',
      action: 'tel:+2348012345678'
    },
    {
      icon: <MessageSquareIcon size={20} />,
      title: 'Live Chat',
      description: 'Chat with support team',
      contact: 'Available 9 AM - 5 PM WAT',
      action: '#'
    }
  ];

  const handleFaqToggle = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await createSupportTicket({
        user_id: user.id,
        subject: contactForm.subject,
        description: contactForm.message,
        priority: contactForm.priority as 'low' | 'medium' | 'high'
      });
      setSubmitStatus('success');
      setContactForm({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      console.error('Error creating ticket:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-sm text-gray-500">
          Get help with your ambassador activities and platform usage
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FAQs */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map(faq => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => handleFaqToggle(faq.id)}
                  className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUpIcon size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDownIcon size={16} className="text-gray-500" />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Contact Support</h2>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={contactForm.subject}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={contactForm.priority}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={contactForm.message}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-ash-teal focus:outline-none focus:ring-1 focus:ring-ash-teal"
                placeholder="Describe your issue in detail"
                required
              />
            </div>

            {submitStatus === 'success' && (
              <div className="mt-4 rounded-md bg-green-50 p-4">
                <p className="text-sm text-green-800">Ticket created successfully! We'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">Failed to create ticket. Please try again.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-md bg-ash-teal px-4 py-2 text-sm font-medium text-white hover:bg-ash-teal/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <SendIcon size={16} className="mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Other Ways to Get Help</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-center rounded-lg border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer" onClick={() => window.open(method.action, '_blank')}>
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-ash-teal/10 text-ash-teal">
                {method.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{method.title}</h3>
                <p className="text-sm text-gray-500">{method.description}</p>
                <p className="text-sm font-medium text-ash-teal">{method.contact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Help Links */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Quick Help Links</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <a href="#" className="flex items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <HelpCircleIcon size={16} className="mr-3 text-ash-teal" />
            <span className="text-sm font-medium text-gray-900">User Guide</span>
          </a>
          <a href="#" className="flex items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <HelpCircleIcon size={16} className="mr-3 text-ash-teal" />
            <span className="text-sm font-medium text-gray-900">Video Tutorials</span>
          </a>
          <a href="#" className="flex items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <HelpCircleIcon size={16} className="mr-3 text-ash-teal" />
            <span className="text-sm font-medium text-gray-900">Best Practices</span>
          </a>
          <a href="#" className="flex items-center rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
            <HelpCircleIcon size={16} className="mr-3 text-ash-teal" />
            <span className="text-sm font-medium text-gray-900">Community Forum</span>
          </a>
        </div>
      </div>
    </div>
  );
};
