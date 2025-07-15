import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from './logo2.png';
import { createCheckoutSession } from './api/subscriptions';
import PaymentToggle from './PaymentToggle';
import SubscriptionCard from './SubscriptionCard';
import FaqSection from './FaqSection';
import './styles.css';

const API_BASE_URL = 'http://localhost:8080/api/v1';

function transformProductData(products) {
    return products.map(product => {
        const monthlyPrice = product.prices.find(p => p.interval === 'month');
        const yearlyPrice = product.prices.find(p => p.interval === 'year');
        const yearlyDiscountPercentage = monthlyPrice && yearlyPrice
            ? Math.round((1 - (yearlyPrice.unit_amount / 100) / (monthlyPrice.unit_amount / 100 * 12)) * 100)
            : 0;
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
}


function CheckoutPage() {
  React.useEffect(() => {
    document.title = 'Satellytes – Plan auswählen';
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [isMonthly, setIsMonthly] = useState(true);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Get stripeCustomerId and userId from state, query param, or localStorage
  const stripeCustomerId = location.state?.stripeCustomerId || new URLSearchParams(window.location.search).get('stripeCustomerId') || localStorage.getItem('stripe_customer_id');
  const userId = location.state?.userId || new URLSearchParams(window.location.search).get('userId') || localStorage.getItem('user_id');
  console.log('[CheckoutPage] userId:', userId, 'stripeCustomerId:', stripeCustomerId, 'location.state:', location.state);

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (!res.ok) throw new Error('Fehler beim Laden der Pläne');
        const data = await res.json();
        // Default sort: monthly price ascending
        const sortedPlans = transformProductData(data).sort((a, b) => a.monthlyPrice - b.monthlyPrice);
        setPlans(sortedPlans);
      } catch (e) {
        setError(e.message || 'Fehler beim Laden der Pläne');
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleSelectPlan = (planId) => {
    if (selectedPlanId === planId) {
      // Start checkout
      handleCheckout(planId);
    } else {
      setSelectedPlanId(planId);
      setCheckoutError(null);
    }
  };

  const handleCheckout = async (planId) => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan nicht gefunden');
      const priceId = isMonthly ? plan.monthlyPriceId : plan.yearlyPriceId;
      if (!priceId) throw new Error('Preis-ID nicht verfügbar');

      console.log('Creating checkout session with', { priceId, userId, stripeCustomerId });
      const res = await createCheckoutSession(priceId, userId || undefined, stripeCustomerId);
      if (res.sessionUrl) {
        window.location.href = res.sessionUrl;
      } else {
        setCheckoutError('Fehler bei der Session-Erstellung.');
      }
    } catch (e) {
      setCheckoutError(e.message || 'Checkout-Fehler');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Floating Customer List Button */}
      <a
        href="/customers"
        className="fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 transition-all group"
        title="Kundenübersicht"
        style={{ boxShadow: '0 4px 24px rgba(30,64,175,0.18)' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 18.75V17.25A2.25 2.25 0 0015 15h-6a2.25 2.25 0 00-2.25 2.25v1.5M12 11.25a3 3 0 100-6 3 3 0 000 6zm6.75 6v-1.5A4.5 4.5 0 0014.25 11h-4.5A4.5 4.5 0 003.75 15.75v1.5"
          />
        </svg>
        <span className="absolute opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none -top-10 left-1/2 -translate-x-1/2 transition-opacity">Kundenübersicht</span>
      </a>
      <img src={logo} alt="Logo" className="h-16 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Wähle einen Plan</h2>

      {loading ? (
        <div>Lade Pläne...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-8">
            <PaymentToggle isMonthly={isMonthly} onToggle={setIsMonthly} plans={plans} />
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-5xl mb-8">
            {plans.map(plan => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isMonthly={isMonthly}
                isSelected={selectedPlanId === plan.id}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        </>
      )}
      {checkoutError && <div className="text-red-500 mb-4">{checkoutError}</div>}

      <FaqSection />
    </div>
  );
}


export default CheckoutPage;
