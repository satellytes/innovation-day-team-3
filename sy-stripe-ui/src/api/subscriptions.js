// API helper for subscription actions
const API_BASE_URL = 'http://localhost:8080/api/v1';

export async function cancelSubscription(subscriptionId) {
  const res = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Kündigung fehlgeschlagen');
  return res.json();
}
