// API helper for subscription actions
const API_BASE_URL = 'http://localhost:8080/api/v1';

export async function cancelSubscription(subscriptionId) {
  const res = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Kündigung fehlgeschlagen');
  return res.json();
}

export async function createCheckoutSession(priceId, userId, customerId) {
  const res = await fetch(`${API_BASE_URL}/checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, userId, customerId })
  });
  if (!res.ok) {
    let msg = 'Fehler beim Starten des Bezahlvorgangs. Bitte versuchen Sie es später erneut.';
    try {
      const errBody = await res.json();
      if (errBody && errBody.error) {
        msg = errBody.error;
        // Optionally log for debugging
        console.error('Checkout error:', errBody.error);
      }
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}
