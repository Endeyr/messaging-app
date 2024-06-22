import { Middleware } from 'redux'

import {
	connectionEstablished,
	connectionLost,
	initSocket,
	joinRoom,
	leaveRoom,
} from '../features/socket/socketSlice'
import type { SocketInterface } from './SocketFactory'
import SocketFactory from './SocketFactory'

enum SocketEvent {
	Connect = 'connect',
	Disconnect = 'disconnect',
	JoinRoom = 'join-room',
	LeaveRoom = 'leave-room',
	Error = 'err',
}

const socketMiddleware: Middleware = (store) => {
	let socket: SocketInterface

	return (next) => (action) => {
		if (initSocket.match(action)) {
			if (!socket && typeof window !== 'undefined') {
				socket = SocketFactory.create()

				socket.socket.on(SocketEvent.Connect, () => {
					store.dispatch(connectionEstablished())
				})

				socket.socket.on(SocketEvent.Error, (message) => {
					console.error(message)
				})

				socket.socket.on(SocketEvent.Disconnect, (reason) => {
					console.log(reason)
					store.dispatch(connectionLost())
				})
			}
		}

		if (joinRoom.match(action) && socket) {
			const room = action.payload.room
			socket.socket.emit(SocketEvent.JoinRoom, room)
		}

		if (leaveRoom.match(action) && socket) {
			const room = action.payload.room
			socket.socket.emit(SocketEvent.LeaveRoom, room)
		}
		next(action)
	}
}

export default socketMiddleware