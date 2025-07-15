// PaymentToggle.js
import React from 'react';

export default function PaymentToggle({ isMonthly, onToggle, plans = [] }) {
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
                        {discountPercentage === 0 ? '%' : `Spare ${discountPercentage}%`}
                    </span>
                </button>
            </div>
        </div>
    );
}
