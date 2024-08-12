import { z, ZodType } from 'zod'
import type { ProfileFormDataType } from '../types/Profile'

export const profileSchema: ZodType<ProfileFormDataType> = z.object({
	username: z.string().min(1, 'Must be at least 1 character'),
	email: z.string().email().min(1, 'Must be at least 1 character'),
})
