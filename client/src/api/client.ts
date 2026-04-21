import axios, { type InternalAxiosRequestConfig } from 'axios'

function resolveBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim()

  if (!configured) {
    return '/api'
  }

  const withoutTrailingSlash = configured.replace(/\/+$/, '')

  if (withoutTrailingSlash.endsWith('/api')) {
    return withoutTrailingSlash
  }

  return `${withoutTrailingSlash}/api`
}

export const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => config)
