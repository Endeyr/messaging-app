import type { Dispatch, Middleware, MiddlewareAPI } from 'redux'
import { Socket, io } from 'socket.io-client'
import { WEB_SOCKET_HOST } from '../config'
import type { RootState } from './../app/store'

// Define action types as an enum
export enum WebSocketActionType {
	WS_CONNECT = 'WS_CONNECT',
	WS_DISCONNECT = 'WS_DISCONNECT',
	WS_CONNECTED = 'WS_CONNECTED',
	WS_DISCONNECTED = 'WS_DISCONNECTED',
	USER_CONNECTED = 'USER_CONNECTED',
	USER_ONLINE = 'USER_ONLINE',
	CREATE_ROOM = 'CREATE_ROOM',
	JOIN_ROOM = 'JOIN_ROOM',
	LEAVE_ROOM = 'LEAVE_ROOM',
	SEND_MESSAGE = 'SEND_MESSAGE',
	GET_ROOMS = 'GET_ROOMS',
}

export const socketMiddleware: Middleware<Dispatch, RootState> = (
	store: MiddlewareAPI<Dispatch, RootState>
) => {
	let socket: Socket | null = null

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (next) => (action: any) => {
		const { dispatch, getState } = store
		const { auth } = getState()
		if ('type' in action) {
			switch (action.type) {
				case WebSocketActionType.WS_CONNECT:
					if (socket !== null) {
						socket.close()
					}

					socket = io(WEB_SOCKET_HOST)

					socket.on('connect', () => {
						dispatch({ type: WebSocketActionType.WS_CONNECTED })
						if (auth.user && socket) {
							socket.emit('user-connected', auth.user)
						}
					})

					socket.on('disconnect', () => {
						dispatch({ type: WebSocketActionType.WS_DISCONNECTED })
					})

					socket.on('connected', (data) => {
						dispatch({ type: 'USER_JOINED', payload: data })
					})

					socket.on('online', (data) => {
						dispatch({ type: 'USER_ONLINE', payload: data })
					})

					socket.on('room-created', (room) => {
						dispatch({ type: 'ROOM_CREATED', payload: room })
					})

					socket.on('joined-room', (data) => {
						dispatch({ type: 'USER_JOINED_ROOM', payload: data })
					})

					socket.on('left-room', (data) => {
						dispatch({ type: 'USER_LEFT_ROOM', payload: data })
					})

					socket.on('disconnected', (data) => {
						dispatch({ type: 'USER_DISCONNECTED', payload: data })
					})

					socket.on('offline', (data) => {
						dispatch({ type: 'USER_OFFLINE', payload: data })
					})

					socket.on('message-sent', (message) => {
						dispatch({ type: 'MESSAGE_SENT', payload: message })
					})

					socket.on('message-received', (message) => {
						dispatch({ type: 'MESSAGE_RECEIVED', payload: message })
					})

					socket.on('user-rooms', (rooms) => {
						dispatch({ type: 'ROOMS_RECEIVED', payload: rooms })
					})

					break

				case WebSocketActionType.WS_DISCONNECT:
					if (socket !== null) {
						socket.close()
					}
					socket = null
					break

				case WebSocketActionType.USER_CONNECTED:
					if (socket !== null) {
						socket.emit('user-connected', action.payload)
					}
					break

				case WebSocketActionType.USER_ONLINE:
					if (socket !== null) {
						socket.emit('user-online', action.payload)
					}
					break

				case WebSocketActionType.CREATE_ROOM:
					if (socket !== null) {
						socket.emit('user-created-room', action.payload, auth.user)
					}
					break

				case WebSocketActionType.JOIN_ROOM:
					if (socket !== null) {
						socket.emit('user-joined-room', action.payload, auth.user)
					}
					break

				case WebSocketActionType.LEAVE_ROOM:
					if (socket !== null) {
						socket.emit('user-left-room', action.payload, auth.user)
					}
					break

				case WebSocketActionType.SEND_MESSAGE:
					if (socket !== null) {
						socket.emit('message-sent', action.payload)
					}
					break

				case WebSocketActionType.GET_ROOMS:
					if (socket !== null) {
						socket.emit('get-rooms', auth.user)
					}
					break
			}
		}
		return next(action)
	}
}
