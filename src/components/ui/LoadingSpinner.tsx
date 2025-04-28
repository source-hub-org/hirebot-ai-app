import React from "react";

interface LoadingSpinnerProps {
  className?: string;
}

export const LoadingSpinner = ({ className = "" }: LoadingSpinnerProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className={`animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary bg-white p-2 ${className}`}
      ></div>
    </div>
  );
};
