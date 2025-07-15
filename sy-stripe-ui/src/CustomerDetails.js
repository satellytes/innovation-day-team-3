import React, { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal';
import SuccessModal from './SuccessModal';
import { useParams, useNavigate } from 'react-router-dom';
import logo from './logo2.png';
import { createCheckoutSession, cancelSubscription } from './api/subscriptions';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function CustomerDetails() {
  React.useEffect(() => {
    document.title = 'Satellytes – Kundendetails';
  }, []);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`${API_BASE_URL}/customers/${id}/details`);
        if (!res.ok) throw new Error('Fehler beim Laden der Kundendaten');
        const data = await res.json();
        setCustomer(data);
        setPlan(data.plan || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-600 text-lg">Lade Kundendaten...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-red-600 text-lg font-semibold">{error}</div>
    </div>
  );
  if (!customer) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-gray-500 text-lg">Kein Kunde gefunden.</div>
    </div>
  );

  const user = customer.user || {};
  const subscription = customer.subscription;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="mx-auto h-16 sm:h-20 w-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Kundendetails</h1>
          <p className="text-gray-500">Alle relevanten Informationen zum Kunden und Abo auf einen Blick.</p>
        </div>
        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Colorful header with icon */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{user.name || '-'}</h2>
            <div className="text-blue-100">{user.email || '-'}</div>
          </div>
          {/* Details section */}
          <div className="p-8">
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-gray-500 text-xs uppercase mb-1">Stripe Customer ID</div>
                <div className="font-mono text-gray-800 break-all">{user.stripe_customer_id || '-'}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase mb-1">Erstellt am</div>
                <div className="text-gray-800">{user.created_at ? new Date(user.created_at).toLocaleString() : '-'}</div>
              </div>
            </div>
            {/* Subscription section */}
            {subscription ? (
              <div className="mt-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Aktives Abonnement</h3>
                </div>
                <div className="mb-2">
                  <span className="font-semibold">Plan:</span>{' '}
                  {plan ? (
                    <span>
                      <span className="inline-block font-bold text-blue-700">{plan.name || '-'}</span>{' '}
                      <span className="inline-block text-gray-700 ml-2">
                        {plan.amount ? `${(plan.amount / 100).toLocaleString('de-DE', { style: 'currency', currency: plan.currency ? plan.currency.toUpperCase() : 'EUR' })}` : '-'}
                        {plan.interval ? ` / ${plan.interval}` : ''}
                      </span>
                    </span>
                  ) : (
                    <span>{subscription.price_id || '-'}</span>
                  )}
                </div>
                <div className="mb-2"><span className="font-semibold">Status:</span> <span className="capitalize">{subscription.status}</span></div>
                <div className="mb-2"><span className="font-semibold">Läuft bis:</span> {subscription.current_period_end ? new Date(subscription.current_period_end * 1000).toLocaleDateString() : '-'}</div>

              </div>
            ) : (
              <div className="mt-8 flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3" />
                  </svg>
                </div>
                <div className="text-gray-600 text-lg">Kein aktives Abonnement.</div>
              </div>
            )}
          </div>
        </div>
        {/* Actions: Logout, Cancel, Change/Re-add Plan */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className="bg-gray-400 text-white px-8 py-3 rounded-lg hover:bg-gray-500 transition-colors font-medium"
          >
            Logout
          </button>
          {subscription && subscription.status !== 'canceled' ? (
            <>
              <button
                onClick={() => setShowCancelModal(true)}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Abo kündigen
              </button>
              <ConfirmModal
                open={showCancelModal}
                title="Abo kündigen?"
                description="Möchtest du dein Abonnement wirklich kündigen? Diese Aktion kann nicht rückgängig gemacht werden."
                confirmText="Ja, kündigen"
                cancelText="Abbrechen"
                onCancel={() => setShowCancelModal(false)}
                onConfirm={async () => {
                  setShowCancelModal(false);
                  try {
                    await cancelSubscription(subscription.stripe_subscription_id);
                    setShowSuccessModal(true);
                  } catch (e) {
                    alert('Kündigung fehlgeschlagen: ' + (e.message || e));
                  }
                }}
              />
            </>
          ) : (
            <button
              onClick={() => navigate('/', { state: { userId: user.id, stripeCustomerId: user.stripe_customer_id } })}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Abo auswählen
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
      <SuccessModal
        open={showSuccessModal}
        title="Abo gekündigt!"
        description="Dein Abonnement wurde erfolgreich gekündigt."
        buttonText="OK"
        onClose={() => window.location.reload()}
      />
    </div>
  );
}
