import React from 'react';

export default function SuccessModal({ open, title, description, buttonText = 'OK', onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-fade-in">
        <h2 className="text-xl font-bold mb-2 text-green-700">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <div className="flex justify-end">
          <button
            className="px-5 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
            onClick={onClose}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
