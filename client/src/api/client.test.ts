import { describe, expect, it } from 'vitest'
import type { InternalAxiosRequestConfig } from 'axios'

import { withAuthHeader } from './client'

function makeConfig(): InternalAxiosRequestConfig {
  return {
    headers: {},
  } as InternalAxiosRequestConfig
}

describe('api client auth header', () => {
  it('adds bearer token when token exists', () => {
    const config = makeConfig()
    const next = withAuthHeader(config, 'jwt-token')

    expect(next.headers.Authorization).toBe('Bearer jwt-token')
  })

  it('leaves authorization unset when token is empty', () => {
    const config = makeConfig()
    const next = withAuthHeader(config, null)

    expect(next.headers.Authorization).toBeUndefined()
  })
})
