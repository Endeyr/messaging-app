import { createServer } from 'node:http'
import { type AddressInfo } from 'node:net'
import { Server, type Socket as ServerSocket } from 'socket.io'
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
export type SocketData = {
	name: string
	age: string
}

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
	return new Promise((resolve) => {
		socket.once(event, resolve)
	})
}

describe('Socket Tests', () => {
	let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket
	let httpServer: ReturnType<typeof createServer>

	beforeAll(async () => {
		httpServer = createServer(app)
		io = new Server<
			ServerToClientEvents,
			ClientToServerEvents,
			InterServerEvents,
			SocketData
		>(httpServer)

		await new Promise<void>((resolve) => {
			httpServer.listen(() => {
				const port = (httpServer.address() as AddressInfo).port
				clientSocket = ioc(`http://localhost:${port}`, {
					transports: ['websocket'],
					forceNew: true,
				})
				io.on('connection', (socket: ServerSocket) => {
					serverSocket = socket
					console.log('User Connected to Socket:', socket.id)
					resolve()
				})
			})
		})
	})

	afterAll(async () => {
		await new Promise<void>((resolve) => {
			io.close(() => {
				clientSocket.disconnect()
				httpServer.close(() => {
					resolve()
				})
			})
		})
	})

	test('should log connection', async () => {
		const spy = jest.spyOn(console, 'log')
		clientSocket.connect()
		await waitFor(clientSocket, 'connect')
		expect(spy).toHaveBeenCalledWith(
			expect.stringContaining('User Connected to Socket:')
		)
		spy.mockRestore()
	})
})
