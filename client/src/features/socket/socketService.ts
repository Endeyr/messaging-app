import io from 'socket.io-client'
import { WEB_SOCKET_HOST } from '../../config'
import { type UserType } from '../auth/authTypes'
import type { MessageType } from '../message/messageTypes'
import type { RoomType } from './socketTypes'

export const socket = io(WEB_SOCKET_HOST, {
	autoConnect: false,
})

// For debugging
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
	socket.onAny((event, ...args) => {
		console.log(event, args)
	})
}

// Users ws
const userOnline = (user: UserType) => {
	socket.auth = { username: user.username }
	socket.emit('user-online', user)
	return user.username
}

const usersOnline = (cb: (username: string) => void) => {
	// From broadcast
	socket.on('online', (data) => {
		console.log(data.username, ' is online')
		cb(data.username)
	})
}

const joinRoom = (room: RoomType, user: UserType) => {
	socket.emit('user-joined-room', room, user)
}

const leaveRoom = (room: RoomType, user: UserType) => {
	socket.emit('user-left-room', room, user)
}

// Message ws
const sentMessage = (message: MessageType, room: RoomType, user: UserType) => {
	socket.emit('message-sent', {
		content: message,
		room,
		from: user,
	})
}

const receiveMessage = (
	message: MessageType,
	room: RoomType,
	username: UserType
) => {
	socket.on('message-received', () => {
		console.log(message, room, username)
	})
}

// Room ws

const socketService = {
	userOnline,
	usersOnline,
	joinRoom,
	leaveRoom,
	sentMessage,
	receiveMessage,
}

export default socketService
