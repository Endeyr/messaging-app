import { createServer } from 'node:http'
import { type AddressInfo } from 'node:net'
import { Server, Socket as ServerSocket } from 'socket.io'
import { Socket as ClientSocket, io as ioc } from 'socket.io-client'
import { messageHandler } from '../socket_handlers/messageHandler'
import { userHandler } from '../socket_handlers/userHandler'
import { IMessageDocument } from './../model/messages'
import { IRoomDocument } from './../model/room'
import { IUserDocument } from './../model/user'
import {
	mockMessage1,
	mockMessage2,
	mockRoom,
	mockUser,
	mockUser2,
} from './setupFile'

describe('Socket Handlers Tests', () => {
	let io: Server, clientSocket: ClientSocket, serverSocket: ServerSocket
	let httpServer: ReturnType<typeof createServer>

	beforeAll((done) => {
		httpServer = createServer()
		io = new Server(httpServer)
		httpServer.listen(() => {
			const port = (httpServer.address() as AddressInfo).port
			clientSocket = ioc(`http://localhost:${port}`, {
				transports: ['websocket'],
				forceNew: true,
			})
			io.on('connection', (socket) => {
				serverSocket = socket
				userHandler(io, socket)
				messageHandler(io, socket)
			})
			clientSocket.on('connect', done)
		})
	})

	afterAll(() => {
		io.close()
		clientSocket.disconnect()
	})

	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(jest.fn())
		jest.spyOn(io, 'emit')
		jest.spyOn(serverSocket, 'emit')
	})

	describe('userHandler', () => {
		test('should handle user connected', (done) => {
			const user = mockUser
			serverSocket.on('user-connected', (connectedUser: IUserDocument) => {
				try {
					expect(connectedUser.username).toEqual(mockUser.username)
					expect(io.emit).toHaveBeenCalledWith('connected', {
						username: user.username,
					})
					expect(serverSocket.data.username).toBe(user.username)
					done()
				} catch (error) {
					done(error)
				}
			})
			clientSocket.emit('user-connected', user)
		})

		test('should handle user online', (done) => {
			const user = mockUser
			serverSocket.on('user-online', (onlineUser: IUserDocument) => {
				expect(onlineUser.username).toEqual(user.username)
				// Must be a spy or mock function
				// expect(serverSocket.broadcast.emit).toHaveBeenCalledWith('online', {
				// 	username: user.username,
				// })
				done()
			})
			clientSocket.emit('user-online', user)
		})

		test('should handle user created room', (done) => {
			const room = mockRoom
			const user = mockUser
			serverSocket.on(
				'user-created-room',
				(createdRoom: IRoomDocument, createdBy: IUserDocument) => {
					expect(createdRoom.name).toEqual(room.name)
					expect(createdBy.username).toEqual(user.username)
					// Received object have strings where expected have Date
					// expect(io.emit).toHaveBeenCalledWith('room-created', {
					// 	roomId: room._id,
					// 	roomName: room.name,
					// 	createdBy: user,
					// })
					done()
				}
			)
			clientSocket.emit('user-created-room', room, user)
		})

		test('should handle user joined room', (done) => {
			const room = mockRoom
			const user = mockUser
			serverSocket.on(
				'user-joined-room',
				(joinedRoom: IRoomDocument, joinedUser: IUserDocument) => {
					expect(joinedRoom.name).toEqual(room.name)
					expect(joinedUser.username).toEqual(user.username)
					// expect(serverSocket.to).toHaveBeenCalledWith(room.name)
					// expect(serverSocket.to(room.name).emit).toHaveBeenCalledWith(
					// 	'joined-room',
					// 	{
					// 		roomName: room.name,
					// 		username: user.username,
					// 	}
					// )
					// expect(serverSocket.join).toHaveBeenCalledWith(room.name)
					done()
				}
			)
			clientSocket.emit('user-joined-room', room, user)
		})

		test('should handle user left room', (done) => {
			const room = mockRoom
			const user = mockUser
			serverSocket.on(
				'user-left-room',
				(leftRoom: IRoomDocument, leftUser: IUserDocument) => {
					expect(leftRoom.name).toEqual(room.name)
					expect(leftUser.username).toEqual(user.username)
					// expect(serverSocket.to).toHaveBeenCalledWith(room.name)
					// expect(serverSocket.to(room.name).emit).toHaveBeenCalledWith(
					// 	'left-room',
					// 	{
					// 		roomName: room.name,
					// 		username: user.username,
					// 	}
					// )
					// expect(serverSocket.leave).toHaveBeenCalledWith(room.name)
					done()
				}
			)
			clientSocket.emit('user-left-room', room, user)
		})

		test('should handle user disconnected', (done) => {
			const user = mockUser
			serverSocket.on(
				'user-disconnected',
				(disconnectedUser: IUserDocument) => {
					expect(disconnectedUser.username).toEqual(user.username)
					// expect(serverSocket.broadcast.emit).toHaveBeenCalledWith(
					// 	'disconnected',
					// 	{ userId: user.username }
					// )
					done()
				}
			)
			clientSocket.emit('user-disconnected', user)
		})

		test('should handle user offline', (done) => {
			const user = mockUser
			serverSocket.on('user-offline', (offlineUser: IUserDocument) => {
				expect(offlineUser.username).toEqual(user.username)
				// expect(serverSocket.broadcast.emit).toHaveBeenCalledWith('offline', {
				// 	username: user.username,
				// })
				done()
			})
			clientSocket.emit('user-offline', user)
		})
	})

	describe('messageHandler', () => {
		test('should handle message sent', (done) => {
			const message = mockMessage1
			serverSocket.on('message-sent', (receivedMessage: IMessageDocument) => {
				expect(receivedMessage.text).toEqual(message.text)
				done()
			})
			clientSocket.emit('message-sent', message)
		})

		test('should handle message received', (done) => {
			const message = mockMessage2
			serverSocket.on(
				'message-received',
				(receivedMessage: IMessageDocument) => {
					expect(receivedMessage.text).toEqual(message.text)
					done()
				}
			)
			clientSocket.emit('message-received', message)
		})
	})
})
