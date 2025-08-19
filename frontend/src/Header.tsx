import React from 'react';
import { Moon, Sun, LogOut } from 'lucide-react';

export default function Header({ onToggleTheme, onLogout, darkMode }) {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-900 shadow">
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Elvja</h1>
      <div className="flex gap-4 items-center">
        <button onClick={onToggleTheme} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
        </button>
        <button onClick={onLogout} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
          <LogOut size={20}/>
        </button>
      </div>
    </header>
  );
}
