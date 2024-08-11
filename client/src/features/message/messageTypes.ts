export type MessageType = {
	_id: string
	sent_from: string
	sent_to?: string
	room?: string
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

export type MessageFormDataType = {
	sent_to?: string
	room?: string
	text: string
	media_url?: string
}
