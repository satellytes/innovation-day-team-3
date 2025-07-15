// SubscriptionCard.js
import React from 'react';

export default function SubscriptionCard({ plan, isMonthly, isSelected, onSelect }) {
    const price = isMonthly ? plan.monthlyPrice : plan.yearlyPrice;
    const priceLabel = isMonthly ? 'Monat' : 'Jahr';
    const showSavings = !isMonthly && plan.yearlyDiscountPercentage > 0 ? plan.yearlyDiscountPercentage : null;

    return (
        <div className={`rounded-xl shadow-lg p-4 sm:p-6 transition-all duration-200 hover:shadow-xl h-full flex flex-col ${
            isSelected 
                ? 'bg-blue-50 border-2 border-blue-500 ring-2 ring-blue-200' 
                : 'bg-white border-2 border-gray-200 hover:border-gray-300'
        } ${plan.id === 'prod_basic' ? 'animate-bounce-slow border-4 border-yellow-400 relative z-10' : ''}`}>
            {/* Header mit Plan-Name und Preis */}
            <div className="text-center mb-6 relative">
                {plan.id === 'prod_basic' && (
                    <span className="badge-popular absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1 text-base animate-pulse shadow-lg z-30">
                        ⭐ Beliebtester Plan
                    </span>
                )}
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
                    {showSavings && (
                        <div className="text-sm text-green-600 font-medium mt-2">
                            {showSavings}% Ersparnis
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
