import { z } from 'zod'

enum RoleEnum {
	user = 'user',
	admin = 'admin',
	moderator = 'moderator',
}

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
		role: z.enum(roleEnumValues),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
