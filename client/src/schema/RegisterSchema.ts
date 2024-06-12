import { z, ZodType } from 'zod'
import { RegisterFormDataType, RoleEnum } from '../types/Register'

const roleEnumValues = Object.values(RoleEnum) as [RoleEnum, ...RoleEnum[]]

export const registerSchema: ZodType<RegisterFormDataType> = z
	.object({
		username: z.string().min(1, 'Username is required'),
		email: z.string().email('Invalid email format').min(1, 'Email is required'),
		password: z
			.string()
			.min(8, { message: 'Password must be at least 8 characters' }),
		confirmPassword: z.string(),
		role: z.array(z.enum(roleEnumValues)),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
