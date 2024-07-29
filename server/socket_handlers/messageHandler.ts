import { type Server, type Socket } from 'socket.io'

export const messageHandler = (io: Server, socket: Socket): void => {
	const messageSent = () => {}
	const messageReceived = () => {}

	socket.emit('message-sent', messageSent)
	socket.emit('message-received', messageReceived)
}
