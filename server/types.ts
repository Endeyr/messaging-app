import { WebSocket } from 'ws'

export type UserStateType = {
	message: string
	typing: boolean
	onlineStatus: 'online' | 'offline'
}

export type UserType = {
	username: string
	state: UserStateType
}

export type ConnectionsType = {
	[key: string]: WebSocket
}

export type UsersType = {
	[key: string]: UserType
}
export type MessageType = {
	from: string
	content: string
	timestamp: string
}
