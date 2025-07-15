// API helper for users endpoint
const API_BASE_URL = 'http://localhost:8080/api/v1';

export async function fetchUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}
