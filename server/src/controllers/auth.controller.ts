import type { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { asyncHandler } from '../utils/asyncHandler'
import { sendSuccess } from '../utils/apiResponse'

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body)
  sendSuccess(res, 201, 'User registered', result)
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  sendSuccess(res, 200, 'Logged in', result)
})
