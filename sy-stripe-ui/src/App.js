import React from 'react';
import logo from './logo.png';

// API-Konfiguration
const API_BASE_URL = 'http://localhost:8080/api/v1';

/**
 * API-Client für Backend-Kommunikation
 */
const apiClient = {
    /**
     * Lädt Produktdaten vom Backend
     * @returns {Promise<Array>} - Array von Produkten mit Preisen
     */
    async getProducts() {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            
            // Transformiere Backend-Daten in Frontend-Format
            return products.map(product => {
                // Finde monatliche und jährliche Preise
                const monthlyPrice = product.prices.find(p => p.interval === 'month');
                const yearlyPrice = product.prices.find(p => p.interval === 'year');
                
                // Berechne Rabatt für jährliche Zahlung
                const yearlyDiscountPercentage = monthlyPrice && yearlyPrice 
                    ? Math.round((1 - (yearlyPrice.unit_amount / 100) / (monthlyPrice.unit_amount / 100 * 12)) * 100)
                    : 0;
                
                return {
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    monthlyPrice: monthlyPrice ? monthlyPrice.unit_amount / 100 : 0,
                    yearlyPrice: yearlyPrice ? yearlyPrice.unit_amount / 100 : 0,
                    yearlyDiscountPercentage,
                    monthlyPriceId: monthlyPrice?.id,
                    yearlyPriceId: yearlyPrice?.id,
                    features: [
                        // Fallback-Features, da Stripe keine Feature-Liste hat
                        'Alle Grundfunktionen',
                        'E-Mail Support',
                        'Monatliche Updates'
                    ]
                };
            });
        } catch (error) {
            console.error('Fehler beim Laden der Produkte:', error);
            throw error;
        }
    }
};

/**
 * PaymentToggle Komponente - Ermöglicht das Umschalten zwischen monatlicher und jährlicher Zahlung
 * @param {boolean} isMonthly - Aktueller Zustand (true = monatlich, false = jährlich)
 * @param {function} onToggle - Callback-Funktion beim Umschalten
 * @param {Array} plans - Verfügbare Pläne für Rabattberechnung
 */
function PaymentToggle({ isMonthly, onToggle, plans = [] }) {
    // Dynamischer Rabattpercentage aus den Plandaten (nimm den ersten verfügbaren)
    const discountPercentage = plans.length > 0 ? plans[0].yearlyDiscountPercentage : 16;

    return (
        <div className="flex justify-center mb-8 px-4">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center w-full max-w-sm sm:w-auto">
                <button
                    onClick={() => onToggle(true)}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 rounded-md font-medium transition-all duration-200 text-sm sm:text-base min-h-[44px] ${
                        isMonthly
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    Monatlich
                </button>
                <button
                    onClick={() => onToggle(false)}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center text-sm sm:text-base min-h-[44px] ${
                        !isMonthly
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <span>Jährlich</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
                        Spare {discountPercentage}%
                    </span>
                </button>
            </div>
        </div>
    );
}

/**
 * SubscriptionCard Komponente - Zeigt einen einzelnen Abonnementplan an
 * @param {object} plan - Plandaten (id, name, prices, features)
 * @param {boolean} isMonthly - Zeigt monatlichen oder jährlichen Preis an
 * @param {boolean} isSelected - Ob dieser Plan aktuell ausgewählt ist
 * @param {function} onSelect - Callback beim Klick auf "Plan auswählen"
 */
function SubscriptionCard({ plan, isMonthly, isSelected, onSelect }) {
    // Berechnung des anzuzeigenden Preises basierend auf Zahlungsintervall
    const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
    const priceLabel = isMonthly ? 'Monat' : 'Jahr';
    const savings = isMonthly ? null : plan.yearlyDiscountPercentage;

    return (
        <div className={`rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-200 hover:shadow-xl h-full flex flex-col ${
            isSelected 
                ? 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-200' 
                : 'bg-white border-2 border-gray-200 hover:border-gray-300'
        }`}>
            {/* Header mit Plan-Name und Preis */}
            <div className="text-center mb-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    {plan.name}
                </h3>
                
                <div className="mb-4">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                        €{price.toFixed(2)}
                    </span>
                    <span className="text-gray-600 ml-1 text-sm sm:text-base">
                        /{priceLabel}
                    </span>
                    {savings && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                            {savings}% Ersparnis
                        </div>
                    )}
                </div>
            </div>

            {/* Feature-Liste */}
            <ul className="space-y-3 mb-6 flex-grow">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        {/* Häkchen-Icon */}
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            {/* Action Button - Touch-optimiert mit min-height */}
            <button
                onClick={() => onSelect(plan.id)}
                className={`w-full py-3 sm:py-4 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base min-h-[48px] ${
                    isSelected
                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                        : 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
                }`}
            >
                {isSelected ? 'Jetzt kaufen' : 'Plan auswählen'}
            </button>
        </div>
    );
}

/**
 * Haupt-App Komponente - Verwaltet den gesamten Anwendungszustand
 */
function App() {
    // Zustandsverwaltung für die Anwendung
    const [isMonthly, setIsMonthly] = React.useState(true); // Zahlungsintervall (monatlich/jährlich)
    const [selectedPlanId, setSelectedPlanId] = React.useState(null); // ID des ausgewählten Plans
    const [paymentStatus, setPaymentStatus] = React.useState('idle'); // Status der Zahlung (idle/loading/success/error)
    const [subscriptionPlans, setSubscriptionPlans] = React.useState([]); // Produktdaten vom Backend
    const [loading, setLoading] = React.useState(true); // Ladezustand für Produktdaten
    const [error, setError] = React.useState(null); // Fehlerzustand

    /**
     * Lädt Produktdaten beim ersten Rendern
     */
    React.useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const products = await apiClient.getProducts();
                
                // Sortiere Produkte nach Preis (aufsteigend)
                // Verwende den monatlichen Preis als Basis für die Sortierung
                const sortedProducts = products.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
                
                setSubscriptionPlans(sortedProducts);
            } catch (err) {
                setError('Fehler beim Laden der Produktdaten. Bitte versuchen Sie es später erneut.');
                console.error('Fehler beim Laden der Produkte:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    /**
     * Handler für das Umschalten zwischen monatlicher und jährlicher Zahlung
     * @param {boolean} monthly - true für monatlich, false für jährlich
     */
    const handleToggle = (monthly) => {
        setIsMonthly(monthly);
    };

    /**
     * Simuliert eine Stripe-Zahlung mit Backend-API-Aufruf
     * In der Produktion würde dies einen echten API-Aufruf an das Backend machen
     * @param {string} planId - ID des zu kaufenden Plans
     * @returns {Promise} - Promise mit Zahlungsergebnis
     */
    const initiateStripePayment = async (planId) => {
        setPaymentStatus('loading');
        
        // Simuliere API-Aufruf mit 2 Sekunden Verzögerung
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simuliere 20% Fehlerrate für realistische Testbedingungen
                if (Math.random() < 0.2) {
                    setPaymentStatus('error');
                    reject(new Error('Zahlung fehlgeschlagen'));
                } else {
                    setPaymentStatus('success');
                    resolve({ success: true, planId });
                }
            }, 2000);
        });
    };

    /**
     * Handler für die Planauswahl und Zahlungsinitiierung
     * Erster Klick: Plan auswählen, Zweiter Klick: Zahlung starten
     * @param {string} planId - ID des geklickten Plans
     */
    const handleSelectPlan = (planId) => {
        if (selectedPlanId === planId) {
            // Plan ist bereits ausgewählt, starte Zahlungsvorgang
            initiateStripePayment(planId).catch(error => {
                console.error('Payment failed:', error);
            });
        } else {
            // Wähle neuen Plan aus und setze Zahlungsstatus zurück
            setSelectedPlanId(planId);
            setPaymentStatus('idle');
        }
    };

    /**
     * Setzt den Zahlungsstatus zurück (schließt Modals)
     */
    const resetPaymentStatus = () => {
        setPaymentStatus('idle');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hauptcontainer mit responsiven Abständen */}
            <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                {/* Header-Bereich */}
                <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                    {/* Logo */}
                    <div className="mb-6 sm:mb-8">
                        <img 
                            src={logo} 
                            alt="Logo" 
                            className="mx-auto h-16 sm:h-20 lg:h-24 w-auto"
                        />
                    </div>
                    
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 leading-tight">
                        Unsere Abonnementpläne
                    </h1>
                    
                    {/* Zahlungsintervall-Umschalter - nur anzeigen wenn Daten geladen */}
                    {!loading && !error && (
                        <PaymentToggle 
                            isMonthly={isMonthly} 
                            onToggle={handleToggle}
                            plans={subscriptionPlans}
                        />
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Produktdaten werden geladen...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Fehler beim Laden</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Erneut versuchen
                        </button>
                    </div>
                )}

                {/* Responsive Grid für Abonnementkarten - nur anzeigen wenn Daten vorhanden */}
                {!loading && !error && subscriptionPlans.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {subscriptionPlans.map((plan) => (
                            <SubscriptionCard
                                key={plan.id}
                                plan={plan}
                                isMonthly={isMonthly}
                                isSelected={selectedPlanId === plan.id}
                                onSelect={handleSelectPlan}
                            />
                        ))}
                    </div>
                )}

                {/* Keine Produkte gefunden */}
                {!loading && !error && subscriptionPlans.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600">Keine Abonnementpläne verfügbar.</p>
                    </div>
                )}
            </div>

            {/* Payment Status Modal - Overlay für Zahlungsfeedback */}
            {paymentStatus !== 'idle' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
                        {/* Loading State */}
                        {paymentStatus === 'loading' && (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    Zahlung wird verarbeitet...
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Bitte warten Sie, während wir Ihre Zahlung bearbeiten.
                                </p>
                            </>
                        )}
                        
                        {/* Success State */}
                        {paymentStatus === 'success' && (
                            <>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    Abonnement erfolgreich abgeschlossen!
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                    Vielen Dank für Ihr Vertrauen. Sie erhalten in Kürze eine Bestätigungs-E-Mail.
                                </p>
                                <button
                                    onClick={resetPaymentStatus}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors min-h-[48px] text-sm sm:text-base"
                                >
                                    Schließen
                                </button>
                            </>
                        )}
                        
                        {/* Error State */}
                        {paymentStatus === 'error' && (
                            <>
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    Zahlung fehlgeschlagen
                                </h3>
                                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                                    Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
                                </p>
                                <button
                                    onClick={resetPaymentStatus}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors min-h-[48px] text-sm sm:text-base"
                                >
                                    Erneut versuchen
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
