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
    color: string;
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
    { icon: Shield, text: "Secure, private dashboards", color: "text-green-600" },
    { icon: Bell, text: "Push notifications for updates", color: "text-blue-600" },
    { icon: Zap, text: "Fast, offline access", color: "text-yellow-500" },
    { icon: Smartphone, text: "Easy home screen access", color: "text-purple-600" }
  ],
  onInstall,
  onDismiss
}) => {
  // Only use state hooks - no callbacks
  const [isVisible, setIsVisible] = useState(false);
  const [showScreenshots, setShowScreenshots] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  // Refs for mutable values that don't trigger re-renders
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
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [isVisible, features.length]);

  // Setup event listeners - only runs once
  useEffect(() => {
    componentMountedRef.current = true;
    checkInstallationStatus();

    // Create event handlers inside effect to avoid closure issues
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
  }, []); // Empty dependency array - runs once

  // Don't render if not visible or already installed
  if (!isVisible || isInstalled) return null;



  // Screenshot gallery
  const screenshotGallery = screenshots.map((src, index) => (
    <div
      key={index}
      className="relative group overflow-hidden rounded-xl shadow-lg"
      style={{ aspectRatio: '9/16' }}
    >
      <img
        src={src}
        alt={`${appName} screenshot ${index + 1}`}
        className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  ));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={`Install ${appName}`}
    >
      {/* Backdrop */}
      {isVisible && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={dismissPrompt}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          w-full max-w-md bg-white border border-gray-200/50
          shadow-2xl rounded-2xl overflow-hidden transition-all duration-500
          ease-out transform pointer-events-auto
          ${isVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
          }
        `}
      >
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            className="absolute -top-2 -right-2 p-2 text-gray-400 hover:text-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     rounded-full transition-colors duration-200 hover:bg-gray-100"
            onClick={dismissPrompt}
            aria-label="Close install prompt"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={appIcon}
                alt={`${appName} icon`}
                className="w-16 h-16 rounded-2xl border-2 border-gray-200 shadow-lg"
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 animate-pulse" />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                Add to Home Screen
              </h2>
              <p className="text-sm text-gray-600 max-w-[280px]">
                Get {appName} on your home screen for the best experience
              </p>
            </div>
          </div>
        </div>

        {/* Features Slideshow */}
        <div className="px-6 pb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Icon
                    key={index}
                    size={24}
                    className={`${
                      index === currentFeatureIndex ? feature.color : 'text-gray-400'
                    } transition-colors duration-500`}
                  />
                );
              })}
            </div>
            <div className="h-12 flex items-center justify-center">
              <p className="text-sm text-gray-700 leading-relaxed transition-opacity duration-500">
                {features[currentFeatureIndex].text}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentFeatureIndex
                      ? 'bg-blue-600 scale-125'
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
        <div className="px-6 pb-6 space-y-3">
          <button
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              font-semibold text-white shadow-lg transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white
              ${isInstalling
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95'
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
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700
                       bg-gray-100/80 hover:bg-gray-200 rounded-lg transition-colors
                       focus:outline-none focus:ring-2 focus:ring-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={toggleScreenshots}
              disabled={isInstalling}
            >
              {showScreenshots ? 'Hide Preview' : 'Preview'}
            </button>

            <button
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600
                       bg-gray-100/80 hover:bg-gray-200 rounded-lg transition-colors
                       focus:outline-none focus:ring-2 focus:ring-gray-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={dismissPrompt}
              disabled={isInstalling}
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Screenshot Gallery */}
        {showScreenshots && (
          <div className="bg-gray-50 px-6 pb-6 pt-0">
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
              transform: translateY(24px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;