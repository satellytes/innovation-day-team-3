import React from 'react';
import logo from './logo2.png';

/**
 * Mock-Daten für Abonnementpläne
 * In einer Produktionsumgebung würden diese Daten von einem Backend/API stammen
 */
const subscriptionPlans = [
    {
        id: 'basic',
        name: 'Basic Plan',
        monthlyPrice: 9.99,
        yearlyPrice: 99.99,
        yearlyDiscountPercentage: 16,
        features: [
            'Bis zu 5 Projekte',
            '10 GB Speicherplatz',
            'E-Mail Support',
            'Grundlegende Analytics'
        ]
    },
    {
        id: 'standard',
        name: 'Standard Plan',
        monthlyPrice: 19.99,
        yearlyPrice: 199.99,
        yearlyDiscountPercentage: 16,
        features: [
            'Bis zu 25 Projekte',
            '100 GB Speicherplatz',
            'Prioritäts-Support',
            'Erweiterte Analytics',
            'Team-Kollaboration',
            'API-Zugang'
        ]
    },
    {
        id: 'premium',
        name: 'Premium Plan',
        monthlyPrice: 39.99,
        yearlyPrice: 399.99,
        yearlyDiscountPercentage: 16,
        features: [
            'Unbegrenzte Projekte',
            '1 TB Speicherplatz',
            '24/7 Premium Support',
            'Vollständige Analytics Suite',
            'Erweiterte Team-Features',
            'White-Label Optionen',
            'Custom Integrationen',
            'Dedicated Account Manager'
        ]
    }
];

/**
 * PaymentToggle Komponente - Ermöglicht das Umschalten zwischen monatlicher und jährlicher Zahlung
 * @param {boolean} isMonthly - Aktueller Zustand (true = monatlich, false = jährlich)
 * @param {function} onToggle - Callback-Funktion beim Umschalten
 */
function PaymentToggle({ isMonthly, onToggle }) {
    // Dynamischer Rabattpercentage aus den Plandaten
    const discountPercentage = subscriptionPlans[0].yearlyDiscountPercentage;

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
    // Erkennung des beliebtesten Plans
    const isPopular = plan.id === 'standard';
    // Berechnung des anzuzeigenden Preises basierend auf Zahlungsintervall
    const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
    const priceLabel = isMonthly ? 'Monat' : 'Jahr';
    const savings = isMonthly ? null : plan.yearlyDiscountPercentage;

    return (
        <div
            className={`bg-white rounded-lg shadow p-6 flex flex-col card-hover transition-all duration-200 relative 
                ${isPopular ? 'ring-4 ring-blue-300 shadow-xl scale-105 z-10' : ''}
            `}
            style={isPopular ? {boxShadow: '0 6px 32px 0 rgba(39,67,166,0.21), 0 2px 8px 0 rgba(59,130,246,0.10)'} : {}}
        >
            {/* Badge für beliebtesten Plan */}
            {isPopular && (
                <span className="badge-popular absolute left-1/2 -top-5 -translate-x-1/2">Beliebtester Plan</span>
            )}
            {/* Header mit Plan-Name und Preis */}
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-royalblue mb-2 font-coco">{plan.name}</h2>
                
                <div className="mb-4 text-royalblue">
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

            {/* Features */}
            <ul className="mb-6 flex-1 space-y-2 text-gray-700">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                        {/* Modernes Check-Icon */}
                        <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" fill="#e6edfa" />
                            <path d="M8 12.5l2.5 2.5 5-5" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Action Button - Touch-optimiert mit min-height */}
            <button
                onClick={() => onSelect(plan.id)}
                className={`w-full py-3 sm:py-4 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base min-h-[48px] border-2 ${
                    isSelected
                        ? 'bg-royalblue text-white border-royalblue hover:bg-blue-700 active:bg-blue-800'
                        : 'bg-royalblue text-white border-royalblue hover:bg-blue-700 active:bg-blue-800'
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
    // Logo-Import

    // Zustandsverwaltung für die Anwendung
    const [isMonthly, setIsMonthly] = React.useState(true); // Zahlungsintervall (monatlich/jährlich)
    const [selectedPlanId, setSelectedPlanId] = React.useState(null); // ID des ausgewählten Plans
    const [paymentStatus, setPaymentStatus] = React.useState('idle'); // Status der Zahlung (idle/loading/success/error)

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
        <div className="min-h-screen flex flex-col relative z-10">
            <div className="background-logo"></div>
            <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
                {/* Header-Bereich */}
                <div className="flex flex-col items-center justify-center mb-8 sm:mb-12 lg:mb-16">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-royalblue leading-tight font-luckiest">
                        Unsere Abonnementpläne
                    </h1>
                    {/* Zahlungsintervall-Umschalter */}
                    <PaymentToggle 
                        isMonthly={isMonthly} 
                        onToggle={handleToggle} 
                    />
                    {/* Abstand nach PaymentToggle */}
                    <div className="h-4 sm:h-6 lg:h-8"></div>
                    {/* Responsive Grid für Abonnementkarten */}
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

                    {/* FAQ-Sektion */}
                    {/* FAQ-Sektion kompakt, näher an Plänen */}
                    <section className="max-w-4xl mx-auto mt-8 mb-6">
                        <div className="bg-blue-50/80 rounded-xl shadow px-4 py-6 md:px-8 md:py-8">
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-royalblue/10 flex items-center justify-center mb-2">
                                    <svg className="w-7 h-7 text-royalblue" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="11" stroke="#2743A6" strokeWidth="2" fill="#e6edfa" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-royalblue text-center font-coco tracking-tight">Häufige Fragen</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                {faqData.map((faq, idx) => (
                                    <FAQItem
                                        key={faq.question}
                                        question={faq.question}
                                        icon={faq.icon}
                                        open={openFaqIdx === idx}
                                        onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                                    >
                                        {faq.answer}
                                    </FAQItem>
                                ))}
                            </div>
                        </div>
                    </section>

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
            <Footer />
        </div>
    );
}

// --- Footer-Komponente ---
function Footer() {
  return (
    <footer className="w-full mt-16 py-6 bg-white/80 border-t border-blue-100 text-center text-gray-500 text-sm">
      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
        <a href="#impressum" className="hover:text-royalblue transition-colors">Impressum</a>
        <span className="hidden sm:inline">|</span>
        <a href="#datenschutz" className="hover:text-royalblue transition-colors">Datenschutz</a>
        <span className="hidden sm:inline">|</span>
        <a href="mailto:kontakt@satellytes.com" className="hover:text-royalblue transition-colors">Kontakt</a>
      </div>
      <div className="mt-2 text-xs text-gray-400">© {new Date().getFullYear()} Satellytes. Alle Rechte vorbehalten.</div>
    </footer>
  );
}

// FAQ-Datenarray mit Fragen, Antworten und kleinen Icons
const faqData = [
    {
        question: "Kann ich mein Abonnement jederzeit kündigen?",
        answer: "Ja, du kannst monatlich kündigen – ganz ohne Mindestlaufzeit oder versteckte Kosten.",
        icon: (
            <svg className="w-4 h-4 text-pink-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" /></svg>
        )
    },
    {
        question: "Welche Zahlungsmethoden werden akzeptiert?",
        answer: "Wir akzeptieren Kreditkarte, SEPA-Lastschrift und PayPal.",
        icon: (
            <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M2 10h20" /></svg>
        )
    },
    {
        question: "Kann ich zwischen den Plänen wechseln?",
        answer: "Ja, ein Wechsel ist jederzeit möglich – Up- und Downgrades werden sofort wirksam.",
        icon: (
            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v7a4 4 0 004 4h12" /><path strokeLinecap="round" strokeLinejoin="round" d="M20 20v-7a4 4 0 00-4-4H4" /></svg>
        )
    },
    {
        question: "Sind meine Daten sicher?",
        answer: "Ja, alle Daten werden DSGVO-konform und verschlüsselt gespeichert.",
        icon: (
            <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 17v1m0-1a4 4 0 01-4-4v-3a4 4 0 018 0v3a4 4 0 01-4 4zm0 0v1m0-1a4 4 0 01-4-4v-3a4 4 0 018 0v3a4 4 0 01-4 4z" /></svg>
        )
    },
    {
        question: "Erhalte ich eine Rechnung?",
        answer: "Ja, nach jeder Zahlung erhältst du automatisch eine Rechnung per E-Mail.",
        icon: (
            <svg className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 10h8M8 14h8" /></svg>
        )
    },
    {
        question: "Gibt es einen Support?",
        answer: "Ja, es gibt einen Support via E-Mail oder Chat von 9–16 Uhr.",
        icon: (
            <svg className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 105.636 18.364 9 9 0 0018.364 5.636z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        )
    },
];

// FAQItem-Komponente (Akkordeon, controlled)
function FAQItem({ question, icon, children, open, onClick }) {
    return (
        <div className={`border border-blue-100 rounded-lg bg-white/80 overflow-hidden transition-shadow ${open ? 'shadow-md' : ''}`}>
            <button
                className="w-full flex items-center justify-between px-4 py-3 text-left font-medium text-royalblue focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
                onClick={onClick}
                aria-expanded={open}
            >
                <span className="flex items-center">
                    {icon}
                    {question}
                </span>
                <svg
                    className={`w-4 h-4 ml-2 transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <div className="px-4 pb-3 pt-0 text-gray-700 text-sm leading-relaxed animate-fadein">
                    {children}
                </div>
            )}
        </div>
    );
}


export default App;

