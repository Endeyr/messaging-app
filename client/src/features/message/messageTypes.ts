export type MessageType = {
	_id: string
	sender: string
	recipient: string
	text: string
	createdAt: string
}

export type MessageDeleteType = {
	id: string
	message: string
}

export type initialStateType = {
	messages: MessageType[]
	isError: boolean
	isSuccess: boolean
	isLoading: boolean
	message: string
}
