import { IMessageDocument } from './../model/messages'
import { type Server, type Socket } from 'socket.io'

export const messageHandler = (io: Server, socket: Socket): void => {
	const messageSent = (message: IMessageDocument) => {
		console.log(message)
	}
	const messageReceived = (message: IMessageDocument) => {
		console.log(message)
	}

	socket.on('message-sent', messageSent)
	socket.on('message-received', messageReceived)
}
