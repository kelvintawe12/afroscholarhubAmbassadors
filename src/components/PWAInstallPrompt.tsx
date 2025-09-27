import React, { useEffect, useState, useRef } from 'react';
import { 
  X, 
  Shield, 
  Bell, 
  Zap, 
  Smartphone, 
  Download,
  ArrowRight 
} from 'lucide-react';

// Type definition for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface PWAInstallPromptProps {
  appName?: string;
  appIcon?: string;
  screenshots?: string[];
  learnMoreUrl?: string;
  features?: Array<{
    icon: React.ComponentType<{ className?: string; size?: number }>;
    text: string;
  }>;
  onInstall?: () => void;
  onDismiss?: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  appName = "Afroscholarhub Ambassadors",
  appIcon = "/icon-192x192.png",
  screenshots = ["/screenshot1.png", "/screenshot2.png"],
  learnMoreUrl = "/about",
  features = [
    { icon: Shield, text: "Secure, private dashboards" },
    { icon: Bell, text: "Push notifications for updates" },
    { icon: Zap, text: "Fast, offline access" },
    { icon: Smartphone, text: "Easy home screen access" }
  ],
  onInstall,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const componentMountedRef = useRef(true);

  // Check if app is already installed
  const checkInstallationStatus = () => {
    if (!componentMountedRef.current) return;
    
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    if (isStandalone && !isInstalled) {
      setIsInstalled(true);
      setIsVisible(false);
    }
  };

  // Handle beforeinstallprompt event
  const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
    if (!componentMountedRef.current) return;
    
    event.preventDefault();
    deferredPromptRef.current = event;
    checkInstallationStatus();
    
    if (!isInstalled) {
      setIsVisible(true);
    }
  };

  // Handle app installation completion
  const handleAppInstalled = () => {
    if (!componentMountedRef.current) return;
    
    setIsInstalled(true);
    setIsVisible(false);
    deferredPromptRef.current = null;
    onInstall?.();
  };

  // Install the app
  const installApp = async () => {
    if (!deferredPromptRef.current || isInstalling) return;

    setIsInstalling(true);
    
    try {
      deferredPromptRef.current.prompt();
      const { outcome } = await deferredPromptRef.current.userChoice;
      
      if (outcome === 'accepted') {
        handleAppInstalled();
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    } finally {
      deferredPromptRef.current = null;
      setIsInstalling(false);
    }
  };

  // Handle prompt dismissal
  const dismissPrompt = () => {
    if (!componentMountedRef.current) return;
    
    setIsVisible(false);
    deferredPromptRef.current = null;
    onDismiss?.();
  };

  // Toggle screenshots visibility
  const toggleScreenshots = () => {
    setShowScreenshots(prev => !prev);
  };

  // Cycle through features for slideshow
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setCurrentFeatureIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 4000); // Change slide every 4 seconds for a smoother pace

    return () => clearInterval(interval);
  }, [isVisible, features.length]);

  // Setup event listeners
  useEffect(() => {
    componentMountedRef.current = true;
    checkInstallationStatus();

    const beforeInstallHandler = (event: any) => {
      if (
        event &&
        typeof event === "object" &&
        "prompt" in event &&
        "userChoice" in event
      ) {
        handleBeforeInstallPrompt(event as BeforeInstallPromptEvent);
      }
    };

    const appInstalledHandler = () => {
      handleAppInstalled();
    };

    window.addEventListener('beforeinstallprompt', beforeInstallHandler);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      componentMountedRef.current = false;
      window.removeEventListener('beforeinstallprompt', beforeInstallHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  if (!isVisible || isInstalled) return null;

  // Screenshot gallery
  const screenshotGallery = screenshots.map((src, index) => (
    <div
      key={index}
      className="relative group overflow-hidden rounded-lg shadow-md"
      style={{ aspectRatio: '9/16' }}
    >
      <img
        src={src}
        alt={`${appName} screenshot ${index + 1}`}
        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  ));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Install ${appName}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={dismissPrompt}
        aria-hidden="true"
      />

      <div
        className={`
          w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden
          pointer-events-auto transform transition-all duration-500 ease-in-out
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}
        `}
      >
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gray-50">
          <button
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700
                     rounded-full transition-colors duration-200 hover:bg-gray-100
                     focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            onClick={dismissPrompt}
            aria-label="Close install prompt"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-4">
            <img
              src={appIcon}
              alt={`${appName} icon`}
              className="w-16 h-16 rounded-xl border border-gray-200 shadow-sm"
            />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Install {appName}</h2>
              <p className="text-sm text-gray-600 max-w-xs">
                Add to your home screen for a seamless, app-like experience.
              </p>
            </div>
          </div>
        </div>

        {/* Features Slideshow */}
        <div className="px-6 py-4 bg-white">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Icon
                    key={index}
                    size={24}
                    className={`${
                      index === currentFeatureIndex ? 'text-teal-600' : 'text-gray-400'
                    } transition-colors duration-500 ease-in-out`}
                  />
                );
              })}
            </div>
            <div className="h-12 flex items-center justify-center">
              <p className="text-sm font-medium text-gray-700 transition-opacity duration-500">
                {features[currentFeatureIndex].text}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFeatureIndex
                      ? 'bg-teal-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentFeatureIndex(index)}
                  aria-label={`Go to feature ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 bg-white space-y-3">
          <button
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              font-semibold text-white shadow-md transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2
              ${isInstalling
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 active:scale-98'
              }
            `}
            onClick={installApp}
            disabled={isInstalling}
            aria-label="Install the app"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Download size={18} />
                Install App
                <ArrowRight size={18} className="ml-auto" />
              </>
            )}
          </button>

          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700
                       bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors
                       focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={toggleScreenshots}
              disabled={isInstalling}
            >
              {showScreenshots ? 'Hide Preview' : 'Show Preview'}
            </button>

            <a
              href={isInstalling ? undefined : learnMoreUrl}
              className={`flex-1 px-4 py-2 text-sm font-medium text-gray-700
                       bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors
                       focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2
                       text-center ${isInstalling ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              tabIndex={isInstalling ? -1 : 0}
              aria-disabled={isInstalling}
              onClick={e => {
                if (isInstalling) {
                  e.preventDefault();
                }
              }}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Screenshot Gallery */}
        {showScreenshots && (
          <div className="bg-gray-50 px-6 pb-6 pt-4">
            <div className="flex gap-3 justify-center">
              {screenshotGallery}
            </div>
          </div>
        )}

        {/* Custom CSS Animation */}
        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(16px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-slideInUp {
            animation: slideInUp 0.5s ease-in-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;