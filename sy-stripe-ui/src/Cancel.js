import React from 'react';
import logo from './logo2.png'; // Webpack will resolve and bundle this

/**
 * Cancel-Seite nach abgebrochenem Checkout
 * Zeigt dem Benutzer, dass die Zahlung abgebrochen wurde und bietet Optionen an
 */
function Cancel() {
    // URL-Parameter auslesen (falls von Stripe übergeben)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');

    const handleBackToPlans = () => {
        window.location.href = '/';
    };

    const handleTryAgain = () => {
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                {/* Header mit Logo */}
                <div className="text-center mb-8">
                    <div className="mb-6">
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="mx-auto h-16 sm:h-20 w-auto"
                        />
                    </div>
                </div>

                {/* Hauptinhalt */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Cancel-Header mit X-Symbol */}
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-12 text-center">
                        {/* Großes oranges X-Symbol */}
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Zahlung abgebrochen
                        </h1>
                        <p className="text-orange-100 text-lg">
                            Kein Problem! Sie können jederzeit zu unseren Plänen zurückkehren.
                        </p>
                    </div>

                    {/* Inhalt */}
                    <div className="p-6 sm:p-8">
                        <div className="max-w-2xl mx-auto text-center">
                            {/* Erklärung */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                    Was ist passiert?
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Der Checkout-Prozess wurde abgebrochen. Dies kann verschiedene Gründe haben:
                                </p>
                            </div>

                            {/* Mögliche Gründe */}
                            <div className="bg-gray-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Mögliche Gründe:
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Sie haben den Vorgang bewusst abgebrochen</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Technische Probleme sind aufgetreten</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Sie möchten einen anderen Plan wählen</span>
                                    </div>
                                    <div className="flex items-start">
                                        <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">Sie benötigen mehr Bedenkzeit</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hilfe und Support */}
                            <div className="bg-blue-50 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Benötigen Sie Hilfe?
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Falls Sie Fragen haben oder Unterstützung benötigen, stehen wir Ihnen gerne zur Verfügung.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a 
                                        href="mailto:support@example.com" 
                                        className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        E-Mail Support
                                    </a>
                                    <a 
                                        href="tel:+49123456789" 
                                        className="inline-flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-blue-700 hover:bg-blue-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                        </svg>
                                        Telefon Support
                                    </a>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={handleTryAgain}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                    Erneut versuchen
                                </button>
                                <button
                                    onClick={handleBackToPlans}
                                    className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Zurück zu den Plänen
                                </button>
                            </div>

                            {/* Session Info für Debug-Zwecke */}
                            {sessionId && (
                                <div className="mt-8 text-xs text-gray-500">
                                    Session ID: {sessionId}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cancel;
