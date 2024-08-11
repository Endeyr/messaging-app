import { type Server, type Socket } from 'socket.io'
import { type IMessageDocument } from './../model/messages'

export const messageHandler = (io: Server, socket: Socket): void => {
	const messageSent = (message: IMessageDocument) => {
		console.log(message)
		io.emit('message-received', `${socket.id} said ${message}`) // broadcast to others in room or private
	}
	const messageReceived = (message: IMessageDocument) => {
		io.emit('message-sent', message)
	}

	socket.on('message-sent', messageSent)
	socket.on('message-received', messageReceived)
}
