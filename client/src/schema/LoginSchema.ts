import { z, ZodType } from 'zod'
import { LoginFormDataType } from '../types/Login'

export const loginSchema: ZodType<LoginFormDataType> = z.object({
	email: z.string().email(),
	password: z.string(),
})
