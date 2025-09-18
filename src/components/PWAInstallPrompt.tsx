import React, { useEffect, useState } from 'react';
import { XIcon, ShieldCheckIcon, BellIcon, ZapIcon, HomeIcon } from 'lucide-react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect if app is already installed
    const checkInstalled = () => {
      // For most browsers
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setShowPrompt(false);
      }
      // For iOS Safari
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        setShowPrompt(false);
      }
    };
    checkInstalled();

    // Listen for install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      checkInstalled();
      if (!isInstalled) setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for appinstalled event
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
    // eslint-disable-next-line
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-white shadow-2xl rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 border border-gray-200 max-w-md w-full transition-transform duration-700 ease-out animate-slide-in"
      role="dialog"
      aria-modal="true"
      aria-label="Install Afroscholarhub Ambassadors"
      style={{ animation: 'slideIn 0.7s cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        aria-label="Close install prompt"
        onClick={handleClose}
      >
        <XIcon size={20} />
      </button>
      <img
        src="/icon-192x192.png"
        alt="Afroscholarhub Ambassadors App Icon"
        className="w-16 h-16 rounded-full border shadow animate-bounce"
      />
      <div className="flex-1">
        <h2 className="font-bold text-xl mb-1 text-ash-gold">Install Afroscholarhub Ambassadors</h2>
        <p className="text-sm text-gray-700 mb-2">
          Experience the best of African scholarship and collaboration. Installing the app gives you:
        </p>
        <ul className="text-sm text-gray-600 mb-2">
          <li className="flex items-center gap-2"><ShieldCheckIcon size={16} className="text-green-600" /> Secure, private access to your dashboards</li>
          <li className="flex items-center gap-2"><BellIcon size={16} className="text-blue-600" /> Push notifications for updates and events</li>
          <li className="flex items-center gap-2"><ZapIcon size={16} className="text-yellow-500" /> Fast, reliable performance even offline</li>
          <li className="flex items-center gap-2"><HomeIcon size={16} className="text-purple-600" /> Easy access from your home screen</li>
        </ul>
        <a
          href="/about"
          className="text-xs text-blue-600 underline hover:text-blue-800 mb-2 inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about the app
        </a>
        <div className="flex gap-2 mt-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 duration-200"
            onClick={handleInstallClick}
          >
            Install
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition transform hover:scale-105 active:scale-95 duration-200"
            onClick={() => setShowScreenshots(!showScreenshots)}
          >
            {showScreenshots ? 'Hide Screenshots' : 'Show Screenshots'}
          </button>
        </div>
        {showScreenshots && (
          <div className="mt-4 flex gap-2">
            <img
              src="/screenshot1.png"
              alt="App screenshot 1"
              className="w-24 h-36 object-cover rounded border"
            />
            <img
              src="/screenshot2.png"
              alt="App screenshot 2"
              className="w-24 h-36 object-cover rounded border"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
