import React, { useState } from 'react';
import Header from './Header';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Header
          onToggleTheme={() => setDarkMode(!darkMode)}
          onLogout={() => { localStorage.removeItem('token'); window.location.reload(); }}
          darkMode={darkMode}
        />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;

