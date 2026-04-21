import type { Response } from 'express'

export interface ApiSuccessBody<T> {
  message: string
  data: T
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T
): void {
  const body: ApiSuccessBody<T> = { message, data }
  res.status(statusCode).json(body)
}
