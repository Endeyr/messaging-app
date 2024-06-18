import axios from 'axios'
import { MessageFormDataType } from './../../types/Message'
import { MessageDeleteType, MessageType } from './messageTypes'

const API_URL = 'http://localhost:5174/message/'

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
