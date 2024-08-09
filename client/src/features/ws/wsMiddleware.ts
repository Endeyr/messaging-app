import type { Middleware } from 'redux'
import { io, type Socket } from 'socket.io-client'
import { WEB_SOCKET_HOST } from '../../config.ts'
import type { MessageType } from '../message/messageTypes.ts'
import { chatActions } from './wsSlice.ts'
import { ChatEvent } from './wsTypes.ts'

export const chatMiddleware: Middleware = (store) => {
	let socket: Socket
	return (next) => (action) => {
		const isConnectionEstablished =
			socket && store.getState().chat.isConnected()

		if (chatActions.startConnecting.match(action)) {
			socket = io(WEB_SOCKET_HOST, {
				autoConnect: false,
			})
		}

		socket.on('connect', () => {
			store.dispatch(chatActions.connectionEstablished())
			socket.emit(ChatEvent.RequestAllMessages)
		})

		socket.on(ChatEvent.SendAllMessages, (messages: MessageType[]) => {
			store.dispatch(chatActions.receiveAllMessages({ messages }))
		})

		socket.on(ChatEvent.ReceiveMessage, (message: MessageType) => {
			store.dispatch(chatActions.receiveMessage({ message }))
		})

		if (chatActions.submitMessage.match(action) && isConnectionEstablished) {
			socket.emit(ChatEvent.SendMessage, action.payload.text)
		}

		next(action)
	}
}
