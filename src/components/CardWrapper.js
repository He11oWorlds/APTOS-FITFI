import React from 'react';

export default function CardWrapper({ children }) {
  return (
    <div className="w-full max-w-sm bg-green-100 px-4 pb-6 rounded-xl shadow-md border border-gray-200">
      {children}
    </div>
  );
}
