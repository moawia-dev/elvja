/// <reference types="vite/client" />

import axios, { AxiosError, AxiosHeaders } from 'axios'

const API = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api'

export const http = axios.create({
  baseURL: API,
  timeout: 15000,
})

// defaults for every request
http.defaults.headers.common['X-Country']  = 'SE'
http.defaults.headers.common['X-Currency'] = 'SEK'

// attach JWT if present
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? new AxiosHeaders()
    ;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
  }
  return config
})

http.interceptors.response.use(
  (r) => r,
  (err: AxiosError) => {
    const status = err.response?.status ?? 0
    const message = (err.response?.data as any)?.message ?? err.message ?? 'Network error'
    return Promise.reject({ status, message, raw: err })
  }
)

export const get  = <T>(url: string, params?: Record<string, any>) => http.get<T>(url, { params }).then(r => r.data)
export const post = <T>(url: string, data?: any) => http.post<T>(url, data).then(r => r.data)
