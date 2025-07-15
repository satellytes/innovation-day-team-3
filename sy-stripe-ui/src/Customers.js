import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo2.png';
import './styles.css';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function Customers() {
  React.useEffect(() => {
    document.title = 'Satellytes – Kundenübersicht';
  }, []);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddRow, setShowAddRow] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [addError, setAddError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/customers`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleGoToProfile = (user) => {
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('stripe_customer_id', user.stripe_customer_id);
    localStorage.setItem('user_name', user.name || '');
    navigate(`/customers/${user.id}`, { state: { userId: user.id, stripeCustomerId: user.stripe_customer_id } });
  };

  const handleSaveNewCustomer = async () => {
    setAddingCustomer(true);
    setAddError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/customers/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCustomer.name, email: newCustomer.email })
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Fehler beim Anlegen des Kunden');
      }
      const created = await res.json();
      const newUser = created.user || created; // fallback for old API
      setUsers([newUser, ...users]);
      setShowAddRow(false);
      setNewCustomer({ name: '', email: '' });
    } catch (e) {
      setAddError(e.message);
    } finally {
      setAddingCustomer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 md:py-20">
      <img src={logo} alt="Logo" className="h-16 mb-6" />
      <h2 className="text-2xl font-bold mb-2">Kundenübersicht</h2>
      {loading ? (
        <div>Lade Kunden...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>

          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 mt-6">
  <table className="min-w-full">
    <thead>
      <tr>
        <th className="py-4 px-6 text-left text-base font-semibold text-gray-600">Name</th>
        <th className="py-4 px-6 text-left text-base font-semibold text-gray-600">E-Mail</th>
        <th className="py-4 px-6 text-left text-base font-semibold text-gray-600">Stripe Customer ID</th>
        <th className="py-4 px-6 text-left text-base font-semibold text-gray-600">Aktion</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.id} className="border-t hover:bg-blue-50 transition-colors">
          <td className="py-4 px-6 align-middle">{user.name}</td>
          <td className="py-4 px-6 align-middle">{user.email}</td>
          <td className="py-4 px-6 align-middle">{user.stripe_customer_id}</td>
          <td className="py-4 px-6 align-middle">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition"
              onClick={() => handleGoToProfile(user)}
            >
              Profil anzeigen
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
        </>
      )}
    </div>
  );
}
