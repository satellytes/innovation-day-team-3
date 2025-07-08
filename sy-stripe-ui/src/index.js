import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';
import Success from './Success';

// Einfaches Routing basierend auf der URL
function Router() {
  const path = window.location.pathname;
  
  if (path === '/success') {
    return <Success />;
  }
  
  return <App />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Router />);
