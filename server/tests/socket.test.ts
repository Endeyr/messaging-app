import { createServer } from 'node:http'
import { type AddressInfo } from 'node:net'
import { Server } from 'socket.io'
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client'
import app from '..'

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
	})

	afterEach((done) => {
		if (clientSocket.connected) clientSocket.disconnect()
		done()
	})

	describe('Socket.io', () => {
		test('should communicate', (done) => {
			io.emit('echo', 'Hello World')
			clientSocket.once('echo', (msg) => {
				expect(msg).toBe('Hello World')
				done()
			})
			io.on('connection', (socket) => {
				expect(socket).toBeDefined()
			})
		})

		test('should communicate with waiting for socket.io handshakes', (done) => {
			// Emits from Client to Server
			clientSocket.emit('user', 'connected')
			// Use timeout to wait for socket.io server handshakes
			setTimeout(() => {
				// Put your server side expect() here
				io.on('user', (msg) => {
					expect(msg).toBe('connected')
				})
				done()
			}, 50)
		})
	})
})
