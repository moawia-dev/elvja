import React, { useEffect } from 'react'
import { setAuth } from '../api'
import { useNavigate } from 'react-router-dom'
export const Login: React.FC = () => {
  const nav = useNavigate()
  
  useEffect(() => {
    // Handle OAuth callback token in URL hash
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const t = hash.get('token');
    if (t) { setAuth(t); nav('/'); }
  }, []);

  const onLogin = () => { setAuth('dev-token'); nav('/') }

  return (
    <div className="h-screen grid place-items-center">
      <div className="card max-w-sm w-full">
        <div className="text-xl font-semibold mb-3">Logga in</div>
        <button className="btn btn-primary w-full mb-2" onClick={onLogin}>Logga in (dev)</button>\n        <a className="btn w-full" href="/api/auth/google/start">Logga in med Google</a>\n        <a className="btn w-full" href="/api/auth/linkedin/start">Logga in med LinkedIn</a>
      </div>
    </div>
  )
}
