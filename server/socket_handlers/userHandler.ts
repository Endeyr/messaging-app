import { type Server, type Socket } from 'socket.io'
import roomModel from '../model/room'
import { type IRoomDocument } from './../model/room'
import { type IUserDocument } from './../model/user'

export const userHandler = (io: Server, socket: Socket): void => {
	const userConnected = (user: IUserDocument) => {
		console.log(`User Connected: ${user.username} (Socket ID: ${socket.id})`)
		// Broadcast to all clients that a new user has connected
		io.emit('connected', { username: user.username })
		socket.data.username = user.username
	}

	const userOnline = (user: IUserDocument) => {
		console.log(`User Online: ${user.username}`)
		// Broadcast to all clients that a user is now online
		socket.broadcast.emit('online', {
			username: user.username,
		})
	}

	const userCreatedRoom = (room: IRoomDocument, user: IUserDocument) => {
		console.log(`Room Created: ${room.name} by ${user.username}`)
		// add user to room
		room.users.push(user)
		// Broadcast to all clients that a new room was created
		io.emit('room-created', room)
	}

	const userJoinedRoom = (room: IRoomDocument, user: IUserDocument) => {
		console.log(`User Joined Room: ${room.name} (User: ${user.username})`)
		// Broadcast to all clients in the room that a new user joined
		socket.to(room.name).emit('joined-room', {
			roomName: room.name,
			username: user.username,
		})
		// Join the socket to the room
		socket.join(room.name)
	}

	const userLeftRoom = (room: IRoomDocument, user: IUserDocument) => {
		console.log(`User Left Room: ${room.name} (User: ${user.username})`)
		// Broadcast to all clients in the room that a user left
		socket
			.to(room.name)
			.emit('left-room', { roomName: room.name, username: user.username })
		// Remove the socket from the room
		socket.leave(room.name)
	}

	const userDisconnected = (user: IUserDocument) => {
		console.log(`User Disconnected: ${user.username}`)
		// Broadcast to all clients that a user has disconnected
		socket.broadcast.emit('disconnected', { userId: user.username })
	}

	const userOffline = (user: IUserDocument) => {
		console.log(`User Offline: ${user.username}`)
		// Broadcast to all clients that a user is now offline
		socket.broadcast.emit('offline', {
			username: user.username,
		})
	}

	socket.on('user-connected', userConnected)
	socket.on('user-online', userOnline)
	socket.on('user-created-room', userCreatedRoom)
	socket.on('user-joined-room', userJoinedRoom)
	socket.on('user-left-room', userLeftRoom)
	socket.on('user-disconnected', userDisconnected)
	socket.on('user-offline', userOffline)
}
