import React from 'react';
import logo from './logo2.png'; // Webpack will resolve and bundle this

/**
 * Success-Seite nach erfolgreichem Checkout
 * Zeigt Benutzerinformationen, Produktdetails und Bestätigung an
 */
import { useEffect, useState } from 'react';

function Success() {
    console.log("Success component rendered");
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setError('Keine Session-ID in der URL gefunden.');
            setLoading(false);
            return;
        }
        console.log("Fetching session:", sessionId);
        fetch(`http://localhost:8080/api/v1/checkout-session/${sessionId}`)
            .then(res => {
                if (!res.ok) throw new Error('Fehler beim Laden der Session-Daten.');
                return res.json();
            })
            .then(data => {
                console.log("Session fetch result:", data);
                setSessionData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [sessionId]);

    const handleBackToHome = () => {
        window.location.href = '/';
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600 text-lg">Lade Bestelldaten...</div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-red-600 text-lg font-semibold">{error}</div>
            </div>
        );
    }

    // Extract nested session and user objects from backend response
    const session = sessionData?.session || {};
    const user = sessionData?.user || {};

    // Prefer Stripe session details, fallback to user DB info
    const customerEmail = session.customer_details?.email || user.email || 'Unbekannt';
    const customerName = session.customer_details?.name || user.name || 'Unbekannt';
    const amount = session.amount_total ? session.amount_total / 100 : null;
    const currency = session.currency || 'eur';
    const productName = session.metadata?.product_name || 'Produkt';
    const interval = session.metadata?.interval || 'monatlich';

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
                    {/* Erfolgs-Header mit großem Checkmark */}
                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-12 text-center">
                        {/* Großer grüner Checkmark */}
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Zahlung erfolgreich!
                        </h1>
                        <p className="text-green-100 text-lg">
                            Vielen Dank für Ihr Vertrauen. Ihr Abonnement wurde erfolgreich aktiviert.
                        </p>
                    </div>

                    {/* Bestelldetails */}
                    <div className="p-6 sm:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Linke Spalte: Benutzer- und Bestellinformationen */}
                            <div className="space-y-6">
                                {/* Benutzerinformationen */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                        </svg>
                                        Kundendaten
                                    </h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Name:</span>
                                            <span className="font-medium text-gray-900">{customerName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">E-Mail:</span>
                                            <span className="font-medium text-gray-900">{customerEmail}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bestellinformationen */}
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                        </svg>
                                        Bestelldetails
                                    </h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Bestell-ID:</span>
                                            <span className="font-medium text-gray-900 font-mono text-sm">{session.id || "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Datum:</span>
                                            <span className="font-medium text-gray-900">{session.created ? new Date(session.created * 1000).toLocaleString() : "-"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Gesamtbetrag:</span>
                                            <span className="font-bold text-gray-900 text-lg">€{amount ? amount.toFixed(2) : "-"} {currency ? currency.toUpperCase() : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rechte Spalte: Produktinformationen */}
                            <div className="bg-blue-50 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    Ihr gewählter Plan
                                </h2>
                                
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{productName}</h3>
                                    <div className="flex items-baseline mb-4">
                                        <span className="text-3xl font-bold text-blue-600">€{amount ? amount.toFixed(2) : "-"}</span>
                                        <span className="text-gray-600 ml-2">/{interval}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900 mb-3">Enthaltene Features:</h4>
                                    {session.metadata?.features
                                        ? session.metadata.features.split(",").map((feature, index) => (
                                            <div key={index} className="flex items-start">
                                                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))
                                        : <span className="text-gray-500">Keine Feature-Liste verfügbar.</span>
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Nächste Schritte */}
                        <div className="mt-8 bg-blue-50 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                                Was passiert als Nächstes?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Bestätigungs-E-Mail</h3>
                                    <p className="text-gray-600 text-sm">Sie erhalten in wenigen Minuten eine Bestätigungs-E-Mail mit allen Details.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Sofortiger Zugang</h3>
                                    <p className="text-gray-600 text-sm">Ihr Konto wurde bereits aktiviert und Sie können sofort loslegen.</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                                    <p className="text-gray-600 text-sm">Unser Premium-Support-Team steht Ihnen rund um die Uhr zur Verfügung.</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex justify-center gap-4">
                            <button
                                onClick={handleBackToHome}
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Zurück zur Startseite
                            </button>
                            {user.id ? (
                                <button
                                    onClick={() => window.location.href = `/customers/${user.id}`}
                                    className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                                >
                                    Zum Kundenprofil
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Success;
