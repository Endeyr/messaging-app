import type { UserType } from '../auth/authTypes'

export type SocketStateType = {
	rooms: RoomType[]
	isConnected: boolean
	isSuccess: boolean
	isError: boolean
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
