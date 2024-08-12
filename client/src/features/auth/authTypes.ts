import { RoleEnum } from '../../types/Register'

export type UserResponseDataType = {
	data: UserType
}

export type UserType = {
	userId: string
	username: string
	email: string
	role?: RoleEnum[]
	createdAt?: Date
	updatedAt?: Date
	token: string
}
