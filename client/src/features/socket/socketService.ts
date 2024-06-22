import io from 'socket.io-client'
import { WEB_SOCKET_HOST } from '../../config'

export const socket = io(WEB_SOCKET_HOST)

const joinRoom = (room: string, username: string) => {
	socket.emit('join_room', room, username)
}

const sendMessage = (message: string, room: string, username: string) => {
	socket.emit('send_message', {
		content: message,
		room,
		from: username,
	})
}

const sendUsername = (username: string) => {
	socket.emit('send_username', username)
}

const socketService = {
	joinRoom,
	sendMessage,
	sendUsername,
}

export default socketService
