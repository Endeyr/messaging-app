export type UserResponseDataType = {
	data: UserType
}

export type UserType = {
	id?: string
	username?: string
	email?: string
	role?: string[]
	token: string
}
