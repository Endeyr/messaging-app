import { type Server, type Socket } from 'socket.io'
import { type IMessageDocument } from './../model/messages'

export const messageHandler = (io: Server, socket: Socket): void => {
	const messageSent = (message: IMessageDocument) => {
		io.emit('message-sent', message)
	}
	const messageReceived = (message: IMessageDocument) => {
		io.emit('message-received', message)
	}

	socket.on('message-sent', messageSent)
	socket.on('message-received', messageReceived)
}
