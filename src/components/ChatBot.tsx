import React, { useEffect, useState, useRef } from 'react';
import { MessageCircleIcon, XIcon, SendIcon, MinimizeIcon, UserIcon, BotIcon, PaperclipIcon, SmileIcon, HelpCircleIcon, ChevronDownIcon, PhoneIcon, MailIcon, ClipboardIcon } from 'lucide-react';
interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  isTyping?: boolean;
  options?: string[];
}
export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: 1,
    text: "Hello! I'm ASH Assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date(),
    options: ['How do I log a school visit?', 'I need help with reporting', 'Connect me with support']
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // Check for mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else if (isMobile) {
      document.body.style.overflow = 'auto';
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    // Show typing indicator
    setIsTyping(true);
    const typingMessage: Message = {
      id: messages.length + 2,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
    // Simulate bot response after a delay
    setTimeout(() => {
      setIsTyping(false);
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      // Generate response based on user message
      let response = '';
      let options: string[] = [];
      const userMessageLower = userMessage.text.toLowerCase();
      if (userMessageLower.includes('visit') || userMessageLower.includes('log')) {
        response = "To log a school visit, go to the 'My Schools' section in your dashboard, find the school you visited, and click 'Log Visit'. You'll need to enter the date, duration, activities conducted, and number of students engaged.";
        options = ['How do I add a new school?', 'Where do I see my past visits?'];
      } else if (userMessageLower.includes('report') || userMessageLower.includes('reporting')) {
        response = "For reporting, navigate to the 'Activity Log' section where you can generate reports based on date ranges, schools visited, or impact metrics. You can export these reports as PDF or Excel files.";
        options = ['How often should I submit reports?', 'Can I schedule automated reports?'];
      } else if (userMessageLower.includes('support') || userMessageLower.includes('help')) {
        response = "I've notified our support team about your query. Someone will reach out to you soon. In the meantime, you can also email support@afroscholarhub.org for direct assistance.";
        options = ['What are the support hours?', 'Is there a phone number I can call?'];
      } else {
        response = "Thank you for your message. I'll help you with that. Could you provide more details about what you're looking for?";
        options = ['Show me common tasks', 'I need technical support', 'How do I update my profile?'];
      }
      const botMessage: Message = {
        id: messages.length + 3,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        options: options
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };
  const handleQuickReply = (option: string) => {
    // Add user message from the quick reply
    const userMessage: Message = {
      id: messages.length + 1,
      text: option,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    // Show typing indicator
    setIsTyping(true);
    const typingMessage: Message = {
      id: messages.length + 2,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
    // Simulate bot response
    setTimeout(() => {
      setIsTyping(false);
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      let response = '';
      let options: string[] = [];
      if (option.includes('log a school visit')) {
        response = "To log a school visit, go to the 'My Schools' section in your dashboard, find the school you visited, and click 'Log Visit'. You'll need to enter the date, duration, activities conducted, and number of students engaged.";
        options = ['How do I add a new school?', 'Where do I see my past visits?'];
      } else if (option.includes('add a new school')) {
        response = "To add a new school, navigate to 'My Schools' and click the 'Add School' button in the top right. Fill in the required details including school name, address, contact person, and potential student count.";
        options = ['How do I track school progress?', 'Back to main menu'];
      } else if (option.includes('reporting')) {
        response = "For reporting, navigate to the 'Activity Log' section where you can generate reports based on date ranges, schools visited, or impact metrics. You can export these reports as PDF or Excel files.";
        options = ['How often should I submit reports?', 'Can I schedule automated reports?'];
      } else if (option.includes('support')) {
        response = 'Our support team is available Monday through Friday, 9AM to 5PM UTC. You can reach us through this chat, by email at support@afroscholarhub.org, or by phone at +1-234-567-8910.';
        options = ['Connect me with a live agent', 'Submit a bug report'];
      } else {
        response = "I understand you're interested in " + option.toLowerCase() + ". Let me guide you through that process step by step. First, could you tell me what specific information you're looking for?";
        options = ['Show me a tutorial', 'I need more specific help', 'Connect with support'];
      }
      const botMessage: Message = {
        id: messages.length + 3,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
        options: options
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <>
      {/* Chat toggle button */}
      <button onClick={toggleChat} className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:shadow-xl ${isOpen ? 'bg-red-500 text-white' : 'bg-ash-teal text-white'}`} aria-label={isOpen ? 'Close chat' : 'Open chat'}>
        {isOpen ? <XIcon size={24} /> : <MessageCircleIcon size={24} />}
      </button>

      {/* Chat window */}
      <div ref={chatContainerRef} className={`fixed z-50 transition-all duration-300 ${isMobile ? `inset-0 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}` : `bottom-24 right-6 ${isOpen ? 'h-[500px] w-96 opacity-100' : 'h-0 w-96 opacity-0'}`}`}>
        <div className={`flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl ${isMobile ? '' : 'max-h-[500px]'}`}>
          {/* Chat header */}
          <div className="flex items-center justify-between bg-ash-teal px-4 py-3 text-white">
            <div className="flex items-center">
              <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <BotIcon size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-medium">ASH Assistant</h3>
                <div className="flex items-center text-xs text-white/80">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-400"></span>
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {!isMobile && <button onClick={() => setExpanded(!expanded)} className="rounded-full p-1.5 hover:bg-ash-teal/80" aria-label={expanded ? 'Minimize chat' : 'Expand chat'}>
                  <ChevronDownIcon size={18} className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>}
              <button onClick={toggleChat} className="rounded-full p-1.5 hover:bg-ash-teal/80" aria-label="Close chat">
                {isMobile ? <XIcon size={18} /> : <MinimizeIcon size={18} />}
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {messages.map(msg => <div key={msg.id} className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg px-4 py-3 ${msg.sender === 'user' ? 'bg-ash-teal text-white' : 'bg-white text-gray-800 shadow'}`}>
                  <div className="flex items-center space-x-2">
                    {msg.sender === 'bot' && <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ash-teal/10 text-ash-teal">
                        <BotIcon size={14} />
                      </div>}
                    <span className="font-medium">
                      {msg.sender === 'user' ? 'You' : 'ASH Assistant'}
                    </span>
                  </div>
                  {msg.isTyping ? <div className="mt-1 flex space-x-1">
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{
                  animationDelay: '0.2s'
                }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{
                  animationDelay: '0.4s'
                }}></div>
                    </div> : <p className="mt-1 text-sm">{msg.text}</p>}
                  {msg.options && msg.options.length > 0 && <div className="mt-3 flex flex-wrap gap-2">
                      {msg.options.map((option, index) => <button key={index} onClick={() => handleQuickReply(option)} className="rounded-full border border-ash-teal bg-white px-3 py-1 text-xs font-medium text-ash-teal transition-colors hover:bg-ash-teal/10">
                          {option}
                        </button>)}
                    </div>}
                  <div className="mt-1 text-right text-xs opacity-70">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>)}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-2">
            <div className="flex justify-between">
              <button className="flex flex-col items-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-ash-teal">
                <HelpCircleIcon size={18} />
                <span className="mt-1 text-xs">Help</span>
              </button>
              <button className="flex flex-col items-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-ash-teal">
                <PhoneIcon size={18} />
                <span className="mt-1 text-xs">Call</span>
              </button>
              <button className="flex flex-col items-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-ash-teal">
                <MailIcon size={18} />
                <span className="mt-1 text-xs">Email</span>
              </button>
              <button className="flex flex-col items-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-ash-teal">
                <ClipboardIcon size={18} />
                <span className="mt-1 text-xs">FAQ</span>
              </button>
            </div>
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-3">
            <div className="flex items-center rounded-lg border border-gray-300 bg-white">
              <button type="button" className="px-2 text-gray-400 hover:text-gray-600">
                <PaperclipIcon size={18} />
              </button>
              <input ref={inputRef} type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." className="flex-1 border-0 py-2 px-1 focus:outline-none focus:ring-0" />
              <button type="button" className="px-2 text-gray-400 hover:text-gray-600">
                <SmileIcon size={18} />
              </button>
              <button type="submit" disabled={!message.trim()} className={`ml-1 rounded-r-lg px-4 py-2 ${message.trim() ? 'bg-ash-teal text-white' : 'bg-gray-200 text-gray-400'}`}>
                <SendIcon size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={toggleChat}></div>}
    </>;
};