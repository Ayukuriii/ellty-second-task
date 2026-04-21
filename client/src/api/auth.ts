import { apiClient } from './client'
import { toApiError } from './errors'
import type { ApiSuccess } from '../types/api.types'
import type { AuthPayload, AuthRequestPayload } from '../types/auth.types'

export async function login(payload: AuthRequestPayload): Promise<AuthPayload> {
  try {
    const response = await apiClient.post<ApiSuccess<AuthPayload>>('/auth/login', payload)
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}

export async function register(payload: AuthRequestPayload): Promise<AuthPayload> {
  try {
    const response = await apiClient.post<ApiSuccess<AuthPayload>>('/auth/register', payload)
    return response.data.data
  } catch (error) {
    throw toApiError(error)
  }
}
