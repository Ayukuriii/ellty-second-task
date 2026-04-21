import axios, { type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'

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

export function withAuthHeader(
  config: InternalAxiosRequestConfig,
  token: string | null,
): InternalAxiosRequestConfig {
  if (!token) {
    return config
  }

  config.headers.Authorization = `Bearer ${token}`
  return config
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token
  return withAuthHeader(config, token)
})
