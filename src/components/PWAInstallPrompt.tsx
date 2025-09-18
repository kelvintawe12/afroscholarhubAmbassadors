import React, { useEffect, useState } from 'react';

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

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

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4 flex items-center gap-4 border border-gray-200">
      <img
        src="/icon-192x192.png"
        alt="Install App"
        className="w-10 h-10 rounded-full border"
      />
      <div>
        <h2 className="font-semibold text-lg">Install Afroscholarhub Ambassadors</h2>
        <p className="text-sm text-gray-600">Get the full app experience on your device.</p>
      </div>
      <button
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleInstallClick}
      >
        Install
      </button>
    </div>
  );
};

export default PWAInstallPrompt;
