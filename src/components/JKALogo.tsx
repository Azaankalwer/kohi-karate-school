import React from 'react';

export function JKALogo({ className = "h-8" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-8 h-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-red-600">
          <div className="absolute inset-1 rounded-full bg-white"></div>
          <div className="absolute inset-2 rounded-full bg-red-600"></div>
          <div className="absolute inset-3 rounded-full bg-white"></div>
        </div>
      </div>
    </div>
  );
}