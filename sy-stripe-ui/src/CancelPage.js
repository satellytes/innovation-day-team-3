import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "./logo2.png";

export default function CancelPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <img src={logo} alt="Logo" className="mx-auto h-16 w-auto mb-6" />
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-9 h-9 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-700 mb-2">Vorgang abgebrochen</h1>
          <p className="text-gray-600 mb-2">Du hast den Bezahlvorgang abgebrochen oder es ist ein Fehler aufgetreten.</p>
          <p className="text-gray-500 mb-4">Deine Buchung wurde nicht abgeschlossen und dir wurde nichts berechnet. Du kannst es gerne noch einmal versuchen oder zur Übersicht zurückkehren.</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Zurück zur Übersicht
        </button>
      </div>
    </div>
  );
}
