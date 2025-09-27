import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  progress?: number; // 0–100
}

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 72,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text,
  fullScreen = false,
  overlay = false,
  progress,
}) => {
  const px = sizeMap[size];

  const brandGradient = "from-emerald-600 via-yellow-500 to-amber-700";

  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-4 p-8 rounded-2xl bg-white/90 shadow-xl backdrop-blur-lg border border-emerald-100 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="relative flex items-center justify-center">
        {/* Gradient Ring */}
        <span
          className={`absolute inset-0 rounded-full animate-spin-slow bg-gradient-to-tr ${brandGradient}`}
          style={{
            width: px + 20,
            height: px + 20,
            zIndex: 1,
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
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="54%"
              textAnchor="middle"
              fill="#064e3b"
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
            } text-emerald-600 animate-spin`}
          />
        )}
      </div>

      {text && (
        <p className="mt-2 text-base text-gray-800 font-semibold text-center animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen || overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-900/40 via-black/40 to-yellow-900/30 backdrop-blur-md">
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
