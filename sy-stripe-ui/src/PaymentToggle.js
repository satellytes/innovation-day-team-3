// PaymentToggle.js
import React from 'react';

export default function PaymentToggle({ isMonthly, onToggle, plans = [] }) {
  // Dynamischer Rabattpercentage aus den Plandaten (nimm den ersten verfügbaren)
  const discountPercentage = plans.length > 0 ? plans[0].yearlyDiscountPercentage : 16;

  return (
    <div className="flex justify-center mb-8 px-4">
      <div className="flex w-full max-w-xs bg-gray-100 rounded-full shadow-md p-1">
        <button
          onClick={() => onToggle(true)}
          className={`flex-1 px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 focus:outline-none
            ${isMonthly ? 'bg-koenigsblau text-white shadow' : 'bg-white text-koenigsblau hover:bg-blue-50'}`}
          style={{
            backgroundColor: isMonthly ? 'var(--koenigsblau, #2743a6)' : '#fff',
            color: isMonthly ? '#fff' : 'var(--koenigsblau, #2743a6)',
          }}
        >
          Monatlich
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`flex-1 px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 focus:outline-none flex items-center justify-center
            ${!isMonthly ? 'bg-koenigsblau text-white shadow' : 'bg-white text-koenigsblau hover:bg-blue-50'}`}
          style={{
            backgroundColor: !isMonthly ? 'var(--koenigsblau, #2743a6)' : '#fff',
            color: !isMonthly ? '#fff' : 'var(--koenigsblau, #2743a6)',
          }}
        >
          Jährlich
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap">
            {discountPercentage === 0 ? '%' : `Spare ${discountPercentage}%`}
          </span>
        </button>
      </div>
    </div>
  );
}
