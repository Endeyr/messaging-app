import type { UserType } from '../auth/authTypes'

export type MessageType = {
	_id: string
	sent_from: Partial<UserType>
	sent_to?: Partial<UserType>
	room?: string
	text: string
	media_url?: string
	createdAt?: string
	updatedAt?: string
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

export type MessageFormDataType = {
	sent_to?: string
	room?: string
	text: string
	media_url?: string
}
