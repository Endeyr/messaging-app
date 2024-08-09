import type { UserType } from '../auth/authTypes'

export type SocketStateType = {
	rooms: RoomType[]
	onlineUsers: string[]
	isConnected: boolean
	isSuccess: boolean
	isError: boolean
	isLoading: boolean
	message: string
}

export type RoomType = {
	users: UserType[]
	name: string
}

export type JoinRoomType = {
	room: RoomType
	user: UserType
}
