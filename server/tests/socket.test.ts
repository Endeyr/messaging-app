import { createServer } from 'node:http'
import { type AddressInfo } from 'node:net'
import { Server } from 'socket.io'
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client'
import app from '../api'
import roomModel from '../model/room'
import messageModel, { IMessageDocument } from './../model/messages'
import { IRoomDocument } from './../model/room'
import { IUserDocument } from './../model/user'
import { mockAdmin, mockRoom, mockUser } from './setupFile'

// Sending and broadcasting events, .emit and .to
export type ServerToClientEvents = {
	// noArgs: () => void
	// basicEmit: (a: number, b: string, c: Buffer) => void
	// withAck: (d: string, callback: (e: number) => void) => void
}
// Receiving events, .on
export type ClientToServerEvents = {}
// Inter-server communication, .serverSideEmit
export type InterServerEvents = {}
// Socket.data attribute, (socket.data)
export type SocketData = {}

describe('Socket Tests', () => {
	let io: Server, clientSocket: ClientSocket
	let httpServer: ReturnType<typeof createServer>

	beforeAll((done) => {
		httpServer = createServer(app).listen()
		io = new Server<
			ServerToClientEvents,
			ClientToServerEvents,
			InterServerEvents,
			SocketData
		>(httpServer)
		done()
	})

	afterAll((done) => {
		io.close()
		httpServer.close()
		done()
	})

	beforeEach((done) => {
		const port = (httpServer.address() as AddressInfo).port
		clientSocket = ioc(`http://localhost:${port}`, {
			transports: ['websocket'],
			forceNew: true,
		})
		clientSocket.on('connect', () => {
			done()
		})
		jest.spyOn(console, 'log').mockImplementation(jest.fn())
	})

	afterEach((done) => {
		if (clientSocket.connected) clientSocket.disconnect()
		jest.clearAllMocks()
		done()
	})

	describe('Socket.io', () => {
		describe('Mock Tests', () => {
			test('should communicate', (done) => {
				// Emits from Server to Client
				io.emit('echo', 'Hello World')
				clientSocket.once('echo', (msg) => {
					expect(msg).toBe('Hello World')
					done()
				})
				io.on('connection', (socket) => {
					expect(socket).toBeDefined()
					expect(socket).toHaveProperty('id')
					const { id } = socket
					console.log(`User Connected to Socket: ${id}`)
					expect(console.log).toHaveBeenCalled()
				})
			})
			test('should communicate a user connected', (done) => {
				// Emits from Client to Server
				clientSocket.emit('user', 'user connected')
				// Use timeout to wait for socket.io server handshakes
				setTimeout(() => {
					// Put your server side expect() here
					io.on('user', (msg) => {
						expect(msg).toBe('user connected')
					})
					done()
				}, 50)
			})
			test('should communicate users online', (done) => {
				// Users will be a query of all users in the db
				const users = ['John', 'Aaron', 'Shawn']
				io.emit('users-online', users, users.length)
				setTimeout(() => {
					clientSocket.on('users-online', (usersOnline, numOfUsersOnline) => {
						expect(usersOnline).toBe(users)
						expect(numOfUsersOnline).toBe(3)
					})
				}, 50)
				done()
			})
			test('should communicate when user creates a room', (done) => {
				// User will be from req.user
				const user = mockUser
				// Users will be a query of all users in a room
				const users: IUserDocument[] = []
				// Add user to users in room
				users.push(user)
				// Room will be user input
				const name = 'Party'
				clientSocket.emit('create-room', user, name)
				setTimeout(() => {
					io.on('create-room', (socket, user, name) => {
						// If room does exist then find room
						// If room doesn't exist create new room
						const room = new roomModel({
							users,
							name,
						})
						socket.join(room.name)
						expect(user).toHaveProperty('email')
						expect(room).toHaveProperty('name', 'Party')
						expect(socket.rooms).toHaveProperty(room.name)
					})
				}, 50)
				done()
			})
			test('should communicate when user joins a room', (done) => {
				const user = mockAdmin
				const room = mockRoom
				clientSocket.emit('join-room', user, room)
				setTimeout(() => {
					io.on('join-room', (user, room) => {
						const users = room.users
						const updatedUsers = users.push(user)
						roomModel.updateOne((rm: IRoomDocument) => rm === room, {
							users: updatedUsers,
						})
						const updatedRoom = roomModel.findOne(
							(rm: IRoomDocument) => rm === room
						)
						expect(updatedRoom).toHaveProperty('users', updatedUsers)
					})
				}, 50)
				done()
			})
			test('should communicate on send message', (done) => {
				const user = 'John'
				const user2 = 'Aaron'
				const message: IMessageDocument = new messageModel({
					sent_from: user,
					sent_to: user2,
					text: 'Here is a message',
				})
				clientSocket.emit('send-message', message)
				setTimeout(() => {
					io.on('send-message', (message) => {
						expect(message).toHaveProperty(
							['sent_from', 'sent_to', 'text'],
							['John', 'Aaron', 'Here is a message']
						)
					})
				}, 50)
				done()
			})
			test('should communicate on receive message', (done) => {
				const user = 'John'
				const user2 = 'Aaron'
				const message: IMessageDocument = new messageModel({
					sent_from: user2,
					sent_to: user,
					text: 'Here is another message',
				})
				io.emit('receive-message', message)
				setTimeout(() => {
					clientSocket.on('receive-message', (message) => {
						expect(message).toHaveProperty(
							['sent_from', 'sent_to', 'text'],
							['Aaron', 'John', 'Here is another message']
						)
					})
				}, 50)
				done()
			})
			test('should communicate on disconnect', (done) => {
				io.on('connection', (socket) => {
					socket.on('disconnect', (reason) => {
						expect(reason).toBeDefined()
					})
					expect(socket).toBeDefined()
					expect(socket).toHaveProperty('id')
					const { id } = socket
					console.log(`User Disconnected from Socket: ${id}`)
					expect(console.log).toHaveBeenCalled()
				})
				done()
			})
		})
	})
})
