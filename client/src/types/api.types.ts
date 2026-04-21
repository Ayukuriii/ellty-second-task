export interface ApiSuccess<T> {
  message: string
  data: T
}

export interface ApiError {
  message: string
  code?: string
  errors?: unknown
}
