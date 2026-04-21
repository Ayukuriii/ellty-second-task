import axios, { type AxiosError } from 'axios'

import type { ApiError } from '../types/api.types'

export function toApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return { message: 'Unexpected client error' }
  }

  const axiosError = error as AxiosError<ApiError>
  const payload = axiosError.response?.data

  if (!payload) {
    return { message: axiosError.message || 'Network error' }
  }

  return {
    message: payload.message || 'Request failed',
    code: payload.code,
    errors: payload.errors,
  }
}
