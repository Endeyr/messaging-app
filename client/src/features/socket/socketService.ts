import io from 'socket.io-client'
import { WEB_SOCKET_HOST } from '../../config'
import { type UserType } from '../auth/authTypes'

export const socket = io(WEB_SOCKET_HOST, {
	autoConnect: false,
})

// For debugging
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	socket.onAny((event, ...args) => {
		console.log(event, args)
	})
}

const newUser = (user: UserType) => {
	socket.auth = { username: user.username }
	socket.emit('new user', user)
}

const joinRoom = (room: string, username: string) => {
	socket.emit('join room', room, username)
}

const leaveRoom = (room: string, username: string) => {
	socket.emit('leave room', room, username)
}

const sendMessage = (message: string, room: string, username: string) => {
	socket.emit('send message', {
		content: message,
		room,
		from: username,
	})
}

const socketService = {
	newUser,
	joinRoom,
	leaveRoom,
	sendMessage,
}

export default socketService
