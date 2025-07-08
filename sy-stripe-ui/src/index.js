// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './styles.css';
// import App from './App';
// import Success from './Success';

// Einfaches Routing basierend auf der URL
function Router() {
  const path = window.location.pathname;
  
  if (path === '/success') {
    return React.createElement(window.Success);
  }
  
  if (path === '/cancel') {
    return React.createElement(window.Cancel);
  }
  
  return React.createElement(window.App);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Router));
