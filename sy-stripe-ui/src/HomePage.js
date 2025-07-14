import React, { useEffect, useState } from 'react';
import logo from './logo2.png';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function HomePage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for adding a customer
  const [showAddRow, setShowAddRow] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '' });
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [addError, setAddError] = useState(null);

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

  useEffect(() => {
    fetch(`${API_BASE_URL}/customers`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load users');
        return res.json();
      })
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSimulate = (user) => {
    localStorage.setItem('user_id', user.id);
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('stripe_customer_id', user.stripe_customer_id);
    localStorage.setItem('user_name', user.name || '');
    window.location.href = '/checkout';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <div className="mb-6 sm:mb-8">
            <img src={logo} alt="Logo" className="mx-auto h-16 sm:h-20 lg:h-24 w-auto" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 leading-tight">
            Wähle einen Kunden aus
          </h1>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6 flex justify-end">
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold shadow"
              onClick={() => setShowAddRow(true)}
              type="button"
            >
              Kunden hinzufügen
            </button>
          </div>
          {loading && <p>Lade Kunden ...</p>}
          {error && <p className="text-red-500">Fehler: {error.message}</p>}
          {!loading && !error && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stripe Customer ID</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showAddRow && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <input
                        className="border rounded px-2 py-1 w-full"
                        type="text"
                        placeholder="Name"
                        value={newCustomer.name}
                        onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        disabled={addingCustomer}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <input
                        className="border rounded px-2 py-1 w-full"
                        type="email"
                        placeholder="E-Mail"
                        value={newCustomer.email}
                        onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        disabled={addingCustomer}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic">(wird automatisch vergeben)</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 ${addingCustomer ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleSaveNewCustomer}
                        disabled={addingCustomer || !newCustomer.name || !newCustomer.email}
                      >
                        {addingCustomer ? 'Speichern...' : 'Speichern'}
                      </button>
                      <button
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={() => { setShowAddRow(false); setNewCustomer({ name: '', email: '' }); setAddError(null); }}
                        disabled={addingCustomer}
                      >
                        Abbrechen
                      </button>
                      {addError && <p className="text-red-500">{addError}</p>}
                    </td>
                  </tr>
                )}
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.stripe_customer_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => handleSimulate(user)}
                      >
                        Simulate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
