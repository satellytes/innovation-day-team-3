// SubscriptionCard.js
import React from 'react';
import './styles.css';

export default function SubscriptionCard({ plan, isMonthly, isSelected, onSelect }) {
    const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
    const priceLabel = isMonthly ? 'Monat' : 'Jahr';
    const showSavings = !isMonthly && plan.yearlyDiscountPercentage > 0 ? plan.yearlyDiscountPercentage : null;

    return (
        <div className="relative flex flex-col h-full" tabIndex={0}>
            <div
                className={`relative z-10 rounded-xl p-4 sm:p-6 transition-all duration-200 h-full flex flex-col bg-white-alpha 
                    ${(plan.name && plan.name.toLowerCase().includes('basic'))
                        ? 'border-2 border-blue-500 shadow-xl scale-105 ring-2 ring-blue-200 hover:scale-110 hover:shadow-2xl active:scale-105 active:shadow-xl'
                        : 'border-2 border-gray-200 hover:border-blue-400 hover:shadow-2xl hover:scale-105 active:scale-105 active:shadow-xl'}
                    focus-within:ring-2 focus-within:ring-blue-300`}
                tabIndex={0}
            >
                {(plan.name && plan.name.toLowerCase().includes('basic')) && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                        <span className="badge-popular">Beliebtester Plan</span>
                    </div>
                )}
                <div className="text-center mb-6 relative">
                    <h3 className="text-2xl sm:text-3xl font-extrabold mb-3 font-oswald text-koenigsblau">
                        {plan.name}
                    </h3>
                    <div className="mb-4">
                        <span className="text-3xl sm:text-4xl font-bold text-koenigsblau">
                            €{price.toFixed(2)}
                        </span>
                        <span className="text-gray-600 ml-1 text-sm sm:text-base">
                            /{priceLabel}
                        </span>
                        {(!isMonthly && plan.yearlyDiscountPercentage > 0) && (
                            <div className="text-sm text-green-600 font-medium mt-2">
                                {plan.yearlyDiscountPercentage}% Ersparnis
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
                    className={`w-full py-3 sm:py-4 px-4 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base min-h-[48px] btn-koenigsblau`}
                >
                    {isSelected ? 'Jetzt kaufen' : 'Plan auswählen'}
                </button>
            </div>
        </div>
    );
}
