import { z } from 'zod'
import { RoleEnum } from '../types/types'

const roleEnumValues = Object.values(RoleEnum) as [RoleEnum, ...RoleEnum[]]

export const userLoginSchema = z.object({
	email: z.string(),
	password: z.string().min(8),
})

export const userRegistrationSchema = z
	.object({
		username: z.string().min(1),
		email: z.string().email().min(1),
		password: z.string().min(8),
		confirmPassword: z.string(),
		role: z.array(z.enum(roleEnumValues)),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export type UserLoginType = z.infer<typeof userLoginSchema>

export type userRegistrationType = z.infer<typeof userRegistrationSchema>
