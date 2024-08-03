import { type UserType } from '../auth/authTypes'
import { type RoomType } from './../../types/Room'

export type MessageType = {
	_id: string
	sent_from: UserType
	sent_to?: UserType
	room?: RoomType
	text: string
	media_url?: string
	createdAt?: Date
	updatedAt?: Date
}

export type MessageDeleteType = {
	id: string
	message: MessageType
}

export type MessageStateType = {
	messages: MessageType[]
	isError: boolean
	isSuccess: boolean
	isLoading: boolean
	message: string
}
