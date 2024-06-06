export type UserStateType = {
	message: string
	typing: boolean
	onlineStatus: 'online' | 'offline'
}

export type UserType = {
	username: string
	state: UserStateType
}

export type UsersType = {
	[key: string]: UserType
}
export type MessageType = {
	room: string
	from: string
	content: string
	timestamp: string
}
