import React from 'react';

export default function ConfirmModal({ open, title, description, confirmText = 'Bestätigen', cancelText = 'Abbrechen', onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-fade-in">
        <h2 className="text-xl font-bold mb-2 text-gray-900">{title}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            className="px-5 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 font-medium"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
