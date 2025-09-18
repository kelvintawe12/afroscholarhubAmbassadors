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
      className="fixed bottom-6 right-6 z-50 backdrop-blur-lg bg-white/80 border border-gray-300 shadow-2xl rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 max-w-lg w-full transition-transform duration-700 ease-out animate-slide-in"
      role="dialog"
      aria-modal="true"
      aria-label="Install Afroscholarhub Ambassadors"
      style={{ animation: 'slideIn 0.7s cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none"
        aria-label="Close install prompt"
        onClick={handleClose}
      >
        <XIcon size={22} />
      </button>
      <div className="flex flex-col items-center gap-2">
        <img
          src="/icon-192x192.png"
          alt="Afroscholarhub Ambassadors App Icon"
          className="w-20 h-20 rounded-2xl border-2 border-ash-gold shadow-lg mb-2 animate-bounce"
        />
        <div className="w-24 h-2 bg-gradient-to-r from-blue-400 via-yellow-400 to-green-400 rounded-full animate-pulse" />
      </div>
      <div className="flex-1">
        <h2 className="font-extrabold text-2xl mb-2 text-ash-gold drop-shadow">Install Afroscholarhub Ambassadors</h2>
        <p className="text-base text-gray-800 mb-3 font-medium">
          Unlock the full experience of African scholarship and collaboration. Installing the app gives you:
        </p>
        <ul className="text-base text-gray-700 mb-3 space-y-2">
          <li className="flex items-center gap-2"><ShieldCheckIcon size={18} className="text-green-600" /> <span>Secure, private dashboards</span></li>
          <li className="flex items-center gap-2"><BellIcon size={18} className="text-blue-600" /> <span>Push notifications for updates</span></li>
          <li className="flex items-center gap-2"><ZapIcon size={18} className="text-yellow-500" /> <span>Fast, reliable offline access</span></li>
          <li className="flex items-center gap-2"><HomeIcon size={18} className="text-purple-600" /> <span>Easy home screen access</span></li>
        </ul>
        <a
          href="/about"
          className="text-xs text-blue-600 underline hover:text-blue-800 mb-3 inline-block"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about the app
        </a>
        <div className="flex gap-3 mt-3">
          <button
            className="px-5 py-2 bg-gradient-to-r from-blue-600 to-ash-gold text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-yellow-600 transition transform hover:scale-105 active:scale-95 duration-200 focus:outline-none"
            onClick={handleInstallClick}
          >
            <ZapIcon size={18} className="inline-block mr-1" /> Install Now
          </button>
          <button
            className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition transform hover:scale-105 active:scale-95 duration-200 focus:outline-none"
            onClick={() => setShowScreenshots(!showScreenshots)}
          >
            {showScreenshots ? 'Hide Screenshots' : 'Show Screenshots'}
          </button>
        </div>
        {showScreenshots && (
          <div className="mt-5 flex gap-3">
            <img
              src="/screenshot1.png"
              alt="App screenshot 1"
              className="w-28 h-40 object-cover rounded-xl border shadow"
            />
            <img
              src="/screenshot2.png"
              alt="App screenshot 2"
              className="w-28 h-40 object-cover rounded-xl border shadow"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
