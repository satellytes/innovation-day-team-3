import React from 'react';
import logo from './logo2.png'; // Webpack will resolve and bundle this
import FaqSection from './FaqSection';
import CancelPage from './CancelPage'; // Import CancelPage at the top

// API-Konfiguration
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Mock-Daten für Entwicklung ohne Backend
const MOCK_PRODUCTS = [
    {
        id: 'prod_basic',
        name: 'Basic Plan',
        description: 'Perfekt für Einsteiger',
        active: true,
        prices: [
            {
                id: 'price_basic_monthly',
                nickname: 'Basic Monthly',
                unit_amount: 999, // 9.99 EUR in Cent
                currency: 'eur',
                interval: 'month',
                created: Date.now()
            },
            {
                id: 'price_basic_yearly',
                nickname: 'Basic Yearly',
                unit_amount: 9990, // 99.90 EUR in Cent (entspricht 8.33 EUR/Monat)
                currency: 'eur',
                interval: 'year',
                created: Date.now()
            }
        ]
    },
    {
        id: 'prod_pro',
        name: 'Pro Plan',
        description: 'Für professionelle Nutzer',
        active: true,
        prices: [
            {
                id: 'price_pro_monthly',
                nickname: 'Pro Monthly',
                unit_amount: 1999, // 19.99 EUR in Cent
                currency: 'eur',
                interval: 'month',
                created: Date.now()
            },
            {
                id: 'price_pro_yearly',
                nickname: 'Pro Yearly',
                unit_amount: 19990, // 199.90 EUR in Cent (entspricht 16.66 EUR/Monat)
                currency: 'eur',
                interval: 'year',
                created: Date.now()
            }
        ]
    },
    {
        id: 'prod_enterprise',
        name: 'Enterprise Plan',
        description: 'Für große Unternehmen',
        active: true,
        prices: [
            {
                id: 'price_enterprise_monthly',
                nickname: 'Enterprise Monthly',
                unit_amount: 4999, // 49.99 EUR in Cent
                currency: 'eur',
                interval: 'month',
                created: Date.now()
            },
            {
                id: 'price_enterprise_yearly',
                nickname: 'Enterprise Yearly',
                unit_amount: 49990, // 499.90 EUR in Cent (entspricht 41.66 EUR/Monat)
                currency: 'eur',
                interval: 'year',
                created: Date.now()
            }
        ]
    }
];

/**
 * API-Client für Backend-Kommunikation
 */
const apiClient = {
    /**
     * Lädt Produktdaten vom Backend oder verwendet Mock-Daten als Fallback
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
            return this.transformProductData(products);
        } catch (error) {
            console.warn('Backend nicht erreichbar, verwende Mock-Daten:', error);
            // Fallback auf Mock-Daten für Entwicklung
            return this.transformProductData(MOCK_PRODUCTS);
        }
    },

    /**
     * Transformiert Produktdaten in das Frontend-Format
     * @param {Array} products - Rohe Produktdaten
     * @returns {Array} - Transformierte Produktdaten
     */
    transformProductData(products) {
        return products.map(product => {
            // Finde monatliche und jährliche Preise
            const monthlyPrice = product.prices.find(p => p.interval === 'month');
            const yearlyPrice = product.prices.find(p => p.interval === 'year');
            
            // Berechne Rabatt für jährliche Zahlung
            const yearlyDiscountPercentage = monthlyPrice && yearlyPrice 
                ? Math.round((1 - (yearlyPrice.unit_amount / 100) / (monthlyPrice.unit_amount / 100 * 12)) * 100)
                : 0;
            
            // Definiere Features basierend auf dem Plan
            let features = [];
            if (product.name.toLowerCase().includes('basic')) {
                features = [
                    'Bis zu 5 Projekte',
                    'E-Mail Support',
                    'Grundlegende Analytics',
                    'Mobile App Zugang'
                ];
            } else if (product.name.toLowerCase().includes('pro')) {
                features = [
                    'Unbegrenzte Projekte',
                    'Prioritäts-Support',
                    'Erweiterte Analytics',
                    'API Zugang',
                    'Team Kollaboration',
                    'Export Funktionen'
                ];
            } else if (product.name.toLowerCase().includes('enterprise')) {
                features = [
                    'Alles aus Pro Plan',
                    'Dedicated Account Manager',
                    'Custom Integrationen',
                    'SLA Garantie',
                    'Advanced Security',
                    'White-Label Optionen',
                    'Onboarding Support'
                ];
            } else {
                // Fallback-Features
                features = [
                    'Alle Grundfunktionen',
                    'E-Mail Support',
                    'Monatliche Updates'
                ];
            }
            
            return {
                id: product.id,
                name: product.name,
                description: product.description,
                monthlyPrice: monthlyPrice ? monthlyPrice.unit_amount / 100 : 0,
                yearlyPrice: yearlyPrice ? yearlyPrice.unit_amount / 100 : 0,
                yearlyDiscountPercentage,
                monthlyPriceId: monthlyPrice?.id,
                yearlyPriceId: yearlyPrice?.id,
                features
            };
        });
    },

    /**
     * Erstellt einen neuen Kunden in Stripe oder simuliert dies mit Mock-Daten
     * @param {string} email - E-Mail-Adresse des Kunden
     * @param {string} name - Name des Kunden
     * @returns {Promise<Object>} - Kundendaten mit user.id
     */
    async createCustomer(email, name) {
        try {
            const response = await fetch(`${API_BASE_URL}/customers/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    name: name
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('Backend nicht erreichbar, simuliere Kundenerstellung:', error);
            // Mock-Antwort für Entwicklung
            return {
                id: `mock_user_${Date.now()}`,
                stripe_customer_id: `cus_mock_${Date.now()}`,
                email: email,
                name: name,
                created_at: new Date().toISOString()
            };
        }
    },

    /**
     * Erstellt eine Checkout-Session für das Abonnement oder simuliert dies mit Mock-Daten
     * @param {string} priceId - Stripe Price ID
     * @param {string} userId - User ID vom erstellten Kunden
     * @returns {Promise<Object>} - Session-Daten mit sessionUrl
     */
    async createCheckoutSession(priceId, userId, stripeCustomerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: priceId,
                    userId: userId,
                    customerId: stripeCustomerId || undefined
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            // Zeige einen klaren Fehler, wenn der Checkout-Session-Request fehlschlägt
            throw new Error('Fehler beim Starten des Bezahlvorgangs. Bitte versuchen Sie es später erneut.');
        }
    }
};




/**
 * Haupt-App Komponente - Verwaltet den gesamten Anwendungszustand
 */
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    // Zustandsverwaltung für die Anwendung
    const [isMonthly, setIsMonthly] = React.useState(true); // Zahlungsintervall (monatlich/jährlich)
    const [selectedPlanId, setSelectedPlanId] = React.useState(null); // ID des ausgewählten Plans
    const [paymentStatus, setPaymentStatus] = React.useState('idle'); // Status der Zahlung (idle/loading/success/error)
    const [subscriptionPlans, setSubscriptionPlans] = React.useState([]); // Produktdaten vom Backend
    const [loading, setLoading] = React.useState(true); // Ladezustand für Produktdaten
    const [error, setError] = React.useState(null); // Fehlerzustand

    // Get stripeCustomerId from state or query param
    const stripeCustomerId = location.state?.stripeCustomerId || new URLSearchParams(window.location.search).get('stripeCustomerId');

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
     * Startet den Stripe Checkout-Prozess
     * @param {string} planId - ID des zu kaufenden Plans
     * @returns {Promise} - Promise mit Checkout-Ergebnis
     */
    const initiateStripePayment = async (planId) => {
        setPaymentStatus('loading');
        
        try {
            // Finde den ausgewählten Plan
            const selectedPlan = subscriptionPlans.find(plan => plan.id === planId);
            if (!selectedPlan) {
                throw new Error('Plan nicht gefunden');
            }

            // Bestimme die richtige Price ID basierend auf dem Zahlungsintervall
            const priceId = isMonthly ? selectedPlan.monthlyPriceId : selectedPlan.yearlyPriceId;
            if (!priceId) {
                throw new Error('Preis-ID nicht verfügbar');
            }

            // Schritt 1: Erstelle Checkout-Session (nutze ggf. Stripe Customer ID)
            const checkoutData = await apiClient.createCheckoutSession(
                priceId,
                null,
                stripeCustomerId || undefined
            );

            // Schritt 3: Weiterleitung zu Stripe Checkout oder Mock-Erfolg
            if (checkoutData.sessionUrl) {
                if (checkoutData.sessionUrl === '#mock-checkout-success') {
                    // Mock-Modus: Simuliere erfolgreiche Zahlung
                    setPaymentStatus('success');
                } else {
                    // Echter Modus: Leite zur Stripe Checkout-Seite weiter
                    window.location.href = checkoutData.sessionUrl;
                }
            } else {
                throw new Error('Keine Session-URL erhalten');
            }

        } catch (error) {
            console.error('Checkout-Fehler:', error);
            setPaymentStatus('error');
            throw error;
        }
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
    <div
        style={{
            backgroundImage: "url('/logo2.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center 180px',
            backgroundSize: '400px auto',
            minHeight: '100vh',
            minWidth: '100vw',
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(180deg, #f5faff 0%, #e6edfa 60%, #fff 100%)',
            backgroundColor: '#fff',
        }}
    >
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 via-white to-white">
                <div className="max-w-7xl mx-auto w-full px-2 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16 mt-6 sm:mt-10 lg:mt-14">

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 sm:mb-8 leading-tight font-oswald uppercase text-koenigsblau">
                            UNSERE ABONNEMENTPLÄNE
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
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8 md:gap-10 xl:gap-12">
  {/* Cards werden auf kleinen Bildschirmen untereinander und mit mehr Abstand gestapelt */}
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

            {/* FAQ unterhalb der Abonnementkarten */}
            <FaqSection />

            {/* Payment Status Modal - Overlay für Zahlungsfeedback */}
            {paymentStatus !== 'idle' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 sm:p-8 max-w-md w-full text-center">
                        {/* Loading State */}
                        {paymentStatus === 'loading' && (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                                    Checkout wird vorbereitet...
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base">
                                    Sie werden gleich zur Stripe Checkout-Seite weitergeleitet.
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
    </div>
  );
}


export default App;
