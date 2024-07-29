import { type Server, type Socket } from 'socket.io'

export const userHandler = (io: Server, socket: Socket): void => {
	const userConnected = () => {}
	const userOnline = () => {}
	const userCreatedRoom = () => {}
	const userJoinedRoom = () => {}
	const userLeftRoom = () => {}
	const userDisconnected = () => {}

	socket.emit('user-connected', userConnected)
	socket.emit('user-online', userOnline)
	socket.emit('user-created-room', userCreatedRoom)
	socket.emit('user-joined-room', userJoinedRoom)
	socket.emit('user-left-room', userLeftRoom)
	socket.emit('user-disconnected', userDisconnected)
}
