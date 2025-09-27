import React, { useState, useEffect } from "react";
import { Loader2, BookOpen, Users, TrendingUp, Zap, Shield, Crown, GraduationCap, Briefcase } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  progress?: number; // 0–100
  context?: "fetching" | "upgrading" | "loading" | "processing";
  role?: "ambassador" | "country-lead" | "management" | "support";
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 72,
};

const contextMessages = {
  fetching: [
    "Fetching your ambassador data...",
    "Connecting scholars across Africa...",
    "Loading impact metrics...",
    "Retrieving your profile information...",
    "Syncing with AfroScholarHub network...",
  ],
  upgrading: [
    "Upgrading your ambassador tools...",
    "Enhancing platform features...",
    "Optimizing your experience...",
    "Applying latest updates...",
    "Boosting performance...",
  ],
  loading: [
    "Loading AfroScholarHub...",
    "Preparing your dashboard...",
    "Initializing scholar connections...",
    "Setting up your workspace...",
    "Welcome to the future of education...",
  ],
  processing: [
    "Processing your request...",
    "Analyzing data insights...",
    "Generating reports...",
    "Updating records...",
    "Securing your information...",
  ],
};

const roleMessages = {
  ambassador: [
    "Empowering scholars worldwide...",
    "Loading your ambassador dashboard...",
    "Fetching your tasks and impact...",
    "Connecting you with global opportunities...",
    "Preparing your personalized experience...",
  ],
  "country-lead": [
    "Leading change in your country...",
    "Loading country leadership tools...",
    "Fetching team and pipeline data...",
    "Preparing regional insights...",
    "Empowering local ambassadors...",
  ],
  management: [
    "Managing global education initiatives...",
    "Loading management analytics...",
    "Fetching reports and metrics...",
    "Preparing oversight tools...",
    "Optimizing platform performance...",
  ],
  support: [
    "Supporting the scholar community...",
    "Loading support resources...",
    "Fetching moderation tools...",
    "Preparing help center...",
    "Ensuring platform integrity...",
  ],
};

const contextIcons = {
  fetching: BookOpen,
  upgrading: Zap,
  loading: Users,
  processing: TrendingUp,
};

const roleIcons = {
  ambassador: GraduationCap,
  "country-lead": Crown,
  management: Briefcase,
  support: Shield,
};

const roleGradients = {
  ambassador: "from-emerald-600 via-yellow-500 to-amber-700",
  "country-lead": "from-blue-600 via-purple-500 to-pink-700",
  management: "from-indigo-600 via-cyan-500 to-teal-700",
  support: "from-red-600 via-orange-500 to-yellow-700",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text,
  fullScreen = false,
  overlay = false,
  progress,
  context = "loading",
  role,
}) => {
  const px = sizeMap[size];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const isRoleBased = !!role;
  const messages = isRoleBased ? roleMessages[role] : contextMessages[context];
  const IconComponent = isRoleBased ? roleIcons[role] : contextIcons[context];
  const currentGradient = isRoleBased ? roleGradients[role] : "from-emerald-600 via-yellow-500 to-amber-700";

  useEffect(() => {
    if (!text) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
      }, 2500); // Change message every 2.5 seconds
      return () => clearInterval(interval);
    }
  }, [messages.length, text]);

  const roleColor = role === "ambassador" ? "emerald" : role === "country-lead" ? "blue" : role === "management" ? "indigo" : "red";
  const subtitleText = role ? `${role.charAt(0).toUpperCase() + role.replace(/-/g, ' ').slice(1)} Dashboard` : "AfroScholarHub Ambassadors";
  const dotColors = isRoleBased ? roleGradients[role].split(' ')[1].replace('-600', '-400') : "emerald-400 yellow-400 amber-400";

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-6 p-10 rounded-3xl bg-white/95 shadow-2xl backdrop-blur-xl border border-${roleColor}-200/50 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex items-center justify-center">
        {/* Outer rotating gradient ring */}
        <span
          className={`absolute inset-0 rounded-full animate-spin-slow bg-gradient-to-tr ${currentGradient} opacity-20`}
          style={{
            width: px + 40,
            height: px + 40,
            zIndex: 1,
          }}
        />
        {/* Inner gradient ring */}
        <span
          className={`absolute inset-0 rounded-full animate-spin bg-gradient-to-tr ${currentGradient}`}
          style={{
            width: px + 20,
            height: px + 20,
            zIndex: 2,
            maskImage: "radial-gradient(circle, white 60%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(circle, white 60%, transparent 70%)",
          }}
        />
        {/* Progress Ring OR Default Spinner */}
        {typeof progress === "number" ? (
          <svg
            width={px + 8}
            height={px + 8}
            viewBox={`0 0 ${px + 8} ${px + 8}`}
            className="relative z-10"
          >
            <circle
              cx={(px + 8) / 2}
              cy={(px + 8) / 2}
              r={px / 2}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="6"
            />
            <circle
              cx={(px + 8) / 2}
              cy={(px + 8) / 2}
              r={px / 2}
              fill="none"
              stroke="url(#grad)"
              strokeWidth="6"
              strokeDasharray={Math.PI * px}
              strokeDashoffset={Math.PI * px * (1 - progress / 100)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.4s" }}
            />
            <defs>
              <linearGradient id="grad" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor={isRoleBased ? `#${roleColor === "emerald" ? "059669" : roleColor === "blue" ? "2563eb" : roleColor === "indigo" ? "4338ca" : "dc2626"}` : "#059669"} />
                <stop offset="100%" stopColor={isRoleBased ? `#${roleColor === "emerald" ? "f59e0b" : roleColor === "blue" ? "a855f7" : roleColor === "indigo" ? "06b6d4" : "f97316"}` : "#f59e0b"} />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              fill={isRoleBased ? `#${roleColor === "emerald" ? "064e3b" : roleColor === "blue" ? "1e3a8a" : roleColor === "indigo" ? "312e81" : "991b1b"}` : "#064e3b"}
              fontSize={px / 3.5}
              fontWeight="600"
              dy=".3em"
            >
              {progress}%
            </text>
          </svg>
        ) : (
          <Loader2
            className={`relative z-10 ${
              size === "sm"
                ? "h-8 w-8"
                : size === "lg"
                ? "h-16 w-16"
                : "h-12 w-12"
            } text-${roleColor}-600 animate-spin`}
          />
        )}
        {/* Context Icon */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <IconComponent
            className={`${
              size === "sm"
                ? "h-4 w-4"
                : size === "lg"
                ? "h-8 w-8"
                : "h-6 w-6"
            } text-white drop-shadow-lg`}
          />
        </div>
      </div>

      {/* Dynamic or Custom Text */}
      <div className="text-center space-y-2">
        <p className="text-lg text-gray-800 font-semibold animate-pulse">
          {text || messages[currentMessageIndex]}
        </p>
        <p className={`text-sm text-${roleColor}-600 font-medium`}>
          {subtitleText}
        </p>
      </div>

      {/* Subtle animation dots */}
      <div className="flex space-x-1">
        <div className={`w-2 h-2 bg-${roleColor}-400 rounded-full animate-bounce`} style={{ animationDelay: "0s" }}></div>
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
      </div>
    </div>
  );

  if (fullScreen || overlay) {
    const overlayGradient = isRoleBased
      ? `from-${roleColor}-900/50 via-black/50 to-${roleColor === "emerald" ? "yellow" : roleColor === "blue" ? "pink" : roleColor === "indigo" ? "teal" : "yellow"}-900/40`
      : "from-emerald-900/50 via-black/50 to-yellow-900/40";
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${overlayGradient} backdrop-blur-md`}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Skeletons
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`animate-pulse bg-gradient-to-tr from-emerald-50 to-yellow-50 rounded-xl shadow-md p-6 border border-emerald-100 ${className}`}
  >
    <div className="h-4 bg-emerald-200/60 rounded w-3/4 mb-4"></div>
    <div className="h-8 bg-yellow-200/60 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-emerald-100/60 rounded w-full"></div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="animate-pulse space-y-3">
    {/* Table Header */}
    <div className="flex space-x-4 mb-3">
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-yellow-200/70 rounded flex-1 shadow-sm"
        ></div>
      ))}
    </div>
    {/* Table Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={colIndex}
            className="h-3 bg-emerald-100/70 rounded flex-1"
          ></div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = "",
}) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-3 rounded ${
          i === lines - 1 ? "w-3/4" : "w-full"
        } bg-gradient-to-r from-emerald-100 to-yellow-100`}
      ></div>
    ))}
  </div>
);

/**
 * Suggested global CSS:
 * .animate-spin-slow { animation: spin 2.4s linear infinite; }
 */
