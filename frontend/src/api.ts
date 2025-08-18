import axios from 'axios'
export const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000')
export const api = axios.create({ baseURL: apiBase })
export function getToken(){ return localStorage.getItem('token') }
export function setAuth(t?: string){ if(t) localStorage.setItem('token', t); else localStorage.removeItem('token'); api.defaults.headers.common['Authorization'] = t ? `Bearer ${t}` : undefined }
