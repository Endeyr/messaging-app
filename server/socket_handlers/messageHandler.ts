import { type Server, type Socket } from 'socket.io'

export const messageHandler = (io: Server, socket: Socket): void => {
	const messageSent = () => {
		console.log('Hello from messageSent')
	}
	const messageReceived = () => {
		console.log('Hello from messageReceived')
	}

	socket.on('message-sent', messageSent)
	socket.on('message-received', messageReceived)
}
