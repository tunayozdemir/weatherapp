'use client'

import { configMessages } from "../../utils"

const ErrorBoundary: React.FC<{ message: string }> = ({ message }) => {

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">{configMessages.text_oops}</h1>
        <p className="text-xl mb-6">{configMessages.text_error_occurred}</p>
        <p className="mb-6">{message}</p>
        <button
          onClick={handleClick}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-lg transition duration-300"
        >
          {configMessages.text_try_again}
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
