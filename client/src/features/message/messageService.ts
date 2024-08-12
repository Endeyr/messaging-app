import axios from 'axios'
import {
	type MessageDeleteType,
	type MessageFormDataType,
	type MessageType,
} from './messageTypes'

const API_URL = `${import.meta.env.VITE_API_URL}/message/`

const createMessage = async (
	messageData: MessageFormDataType,
	username: string,
	token: string
): Promise<MessageType> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	if (messageData.sent_to === username) {
		throw new Error('Cannot send to self')
	}
	const response = await axios.post(API_URL, messageData, config)
	return response.data.message
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
	createMessage,
	getMessages,
	deleteMessage,
}

export default messageService
