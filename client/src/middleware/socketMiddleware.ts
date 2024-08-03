import { type PayloadAction, isAction } from '@reduxjs/toolkit'
import { type Middleware } from 'redux'
import {
	messageSent,
	socketMessageReceived,
} from '../features/message/messageSlice'
import {
	connectionEstablished,
	connectionLost,
	initSocket,
} from '../features/socket/socketSlice'
import { type MessageType } from './../features/message/messageTypes'
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
					socket.socket.on('message', (message: MessageType) => {
						store.dispatch(
							socketMessageReceived({
								_id: message._id,
								sent_from: message.sent_from,
								sent_to: message.sent_to,
								room: message.room,
								text: message.text,
								media_url: message.media_url,
								createdAt: message.createdAt,
								updatedAt: message.updatedAt,
							})
						)
					})
					break
				}
				case messageSent.type: {
					const message = (action as PayloadAction<MessageType>).payload
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
