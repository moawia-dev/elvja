import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { setAuth } from '../api'
import { applyTheme, getInitialTheme } from '../theme'

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const logout = () => { setAuth(undefined); navigate('/login'); };
  const [theme, setTheme] = useState<'light'|'dark'>(getInitialTheme())
  useEffect(() => { applyTheme(theme) }, [theme])

  const navLink = (to: string, label: string) => (
    <NavLink to={to} className={({isActive}) => `px-3 py-2 rounded-xl ${isActive ? 'bg-green-700 text-white' : 'text-gray-800 dark:text-white hover:bg-white/10'}`}>{label}</NavLink>
  );

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] bg-[var(--elvja-sand)] dark:bg-[#0B0E14]">
      <aside className="border-r p-4 dark:border-[#1F2937]">
        <Link to="/" className="block mb-6">
          <div className="text-xl font-bold text-[var(--elvja-ink)] dark:text-white">Elvja</div>
          <div className="text-xs text-[var(--elvja-ink)]/60 dark:text-white/50">AI + Programmatic</div>
        </Link>
        <nav className="flex flex-col gap-2">
          {navLink('/', 'Dashboard')}
          {navLink('/onboarding', 'Onboarding')}
          {navLink('/brandkit', 'Brandkit')}
          {navLink('/editor', 'Annonseditor')}
          {navLink('/ai', 'AI-verktyg')}
        </nav>
        
      </aside>
      <main className="p-6"><Outlet /></main>
    </div>
  )
}
