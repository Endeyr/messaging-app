import type { RoleEnum } from '../../types/Register'

export type UserDataStateType = {
	userData: userDataType | null
	isSuccess: boolean
	isLoading: boolean
	isError: boolean
	message: string
}

export type userDataType = {
	userId: string
	username: string
	email: string
	role: RoleEnum[]
}
