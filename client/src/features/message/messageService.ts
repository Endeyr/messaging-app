import axios from 'axios'
import { MessageFormDataType } from './../../types/Message'
import { MessageType } from './messageTypes'

const API_URL = 'http://localhost:5174/message/'

const createText = async (
	textData: MessageFormDataType
): Promise<MessageType> => {
	const response = await axios.post(API_URL, textData)
	return response.data
}

const messageService = {
	createText,
}

export default messageService
