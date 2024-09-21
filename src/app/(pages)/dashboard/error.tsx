'use client'
import React from 'react';

const ErrorBoundary: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Oops!</h1>
        <p className="text-xl mb-6">Bir hata oluştu.</p>
        <p className="mb-6">{message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg transition duration-300"
        >
          Yeniden Dene
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
