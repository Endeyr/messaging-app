import axios from 'axios'
import { type MessageFormDataType } from './../../types/Message'
import { type MessageDeleteType, type MessageType } from './messageTypes'

const API_URL = `${import.meta.env.VITE_API_URL}/message/`

const createText = async (
	textData: MessageFormDataType,
	token: string
): Promise<MessageType> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.post(API_URL, textData, config)
	return response.data
}

const getMessages = async (token: string): Promise<MessageType[]> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.get(API_URL, config)
	return response.data.messages
}

const deleteMessage = async (
	messageId: string,
	token: string
): Promise<MessageDeleteType> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.delete(API_URL + messageId, config)
	return response.data
}

const messageService = {
	createText,
	getMessages,
	deleteMessage,
}

export default messageService
