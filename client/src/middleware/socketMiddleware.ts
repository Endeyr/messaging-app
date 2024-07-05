import { PayloadAction, isAction } from '@reduxjs/toolkit'
import { Middleware } from 'redux'
import {
	messageSent,
	socketMessageReceived,
} from '../features/message/messageSlice'
import {
	connectionEstablished,
	connectionLost,
	initSocket,
} from '../features/socket/socketSlice'
import type { SocketInterface } from './SocketFactory'
import SocketFactory from './SocketFactory'

enum SocketEvent {
	Connect = 'connect',
	Disconnect = 'disconnect',
	Error = 'err',
}

const socketMiddleware: Middleware = (store) => {
	let socket: SocketInterface

	return (next) => (action: unknown) => {
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
		if (isAction(action)) {
			switch (action.type) {
				case 'user/login/fulfilled': {
					socket.socket.on('message', (message) => {
						store.dispatch(
							socketMessageReceived({
								_id: message.id,
								sender: message.sender,
								recipient: message.recipient,
								text: message.text,
								createdAt: message.createdAt,
							})
						)
					})
					break
				}
				case messageSent.type: {
					const message = (
						action as PayloadAction<{
							id: number
							text: string
							sender: string
						}>
					).payload
					socket.socket.emit('message', message)
					break
				}
				// Disconnect
				case 'socket/disconnect': {
					socket.socket.disconnect()
					break
				}
			}
		}

		return next(action)
	}
}

export default socketMiddleware
