import { z, ZodType } from 'zod'
import { type LoginFormDataType } from '../types/Login'

export const loginSchema: ZodType<LoginFormDataType> = z.object({
	email: z.string().email('Invalid email format').min(1, 'Email is required'),
	password: z.string().min(8, { message: 'Password is required' }),
})
