import { createServer } from 'node:http'
import { type AddressInfo } from 'node:net'
import { Server, Socket as ServerSocket } from 'socket.io'
import { Socket as ClientSocket, io as ioc } from 'socket.io-client'
import app from '..'
import { messageHandler } from '../socket_handlers/messageHandler'
import { userHandler } from '../socket_handlers/userHandler'
import { IUserDocument } from './../model/user'
import { mockMessage1, mockRoom, mockUser, mockUser2 } from './setupFile'

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
	return new Promise((resolve) => {
		socket.once(event, resolve)
	})
}

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
	})

	describe('userHandler', () => {
		beforeAll(() => {
			userHandler(io, serverSocket)
		})
		test('should handle user connected', (done) => {
			const user = mockUser
			serverSocket.emit('user-connected', user)

			setTimeout(() => {
				clientSocket.on('user-connected', (user: IUserDocument) => {
					expect(console.log).toHaveBeenCalledWith(
						`User Connected: ${user.username} (Socket ID: ${serverSocket.id})`
					)
					expect(io.emit).toHaveBeenCalledWith('connected', {
						username: user.username,
					})
					expect(serverSocket.data.username).toBe(user.username)
				})
			}, 50)
			done()
		})
		// test('should handle user online', (done) => {
		// 	done()
		// })
		// test('should handle user created room', (done) => {
		// 	done()
		// })
		// test('should handle user joined room', (done) => {
		// 	done()
		// })
		// test('should handle user left room', (done) => {
		// 	done()
		// })
		// test('should handle user disconnected', (done) => {
		// 	done()
		// })
		// test('should handle user offline', (done) => {
		// 	done()
		// })
	})

	describe('messageHandler', () => {
		beforeAll(() => {
			messageHandler(io, serverSocket)
		})
		test('should handle message sent', (done) => {
			setTimeout(() => {
				clientSocket.on('message-sent', () => {
					expect(console.log).toHaveBeenCalledWith('Hello from messageSent')
				})
			}, 50)
			done()
		})
		// test('should handle message received', (done) => {
		// 	done()
		// })
	})
})
