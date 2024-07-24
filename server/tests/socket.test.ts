import { createServer } from 'node:http'
import { type AddressInfo } from 'node:net'
import { Server, type Socket as ServerSocket } from 'socket.io'
import { io as ioc, type Socket as ClientSocket } from 'socket.io-client'
import app from '..'

// Sending and broadcasting events, .emit and .to
export type ServerToClientEvents = {
	noArgs: () => void
	basicEmit: (a: number, b: string, c: Buffer) => void
	withAck: (d: string, callback: (e: number) => void) => void
}
// Receiving events, .on
export type ClientToServerEvents = {
	hello: () => void
}
// Inter-server communication, .serverSideEmit
export type InterServerEvents = {
	ping: () => void
}
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

	beforeAll((done) => {
		const httpServer = createServer(app)
		io = new Server<
			ServerToClientEvents,
			ClientToServerEvents,
			InterServerEvents,
			SocketData
		>(httpServer)
		httpServer.listen(() => {
			const port = (httpServer.address() as AddressInfo).port
			clientSocket = ioc(`http://localhost:${port}`)
			io.on('connection', (socket: ServerSocket) => {
				serverSocket = socket
			})
			clientSocket.on('connect', done)
		})
	})

	afterAll(() => {
		io.close()
		clientSocket.disconnect()
	})

	test('should work', (done) => {
		clientSocket.on('hello', (arg: string) => {
			expect(arg).toBe('world')
			done()
		})
		serverSocket.emit('hello', 'world')
	})

	test('should work with an acknowledgement', (done) => {
		serverSocket.on('hi', (cb: any) => {
			cb('hola')
		})
		clientSocket.emit('hi', (arg: string) => {
			expect(arg).toBe('hola')
			done()
		})
	})

	test('should work with emitWithAck()', async () => {
		serverSocket.on('foo', (cb: any) => {
			cb('bar')
		})
		const result = await clientSocket.emitWithAck('foo')
		expect(result).toBe('bar')
	})

	test('should work with waitFor()', () => {
		clientSocket.emit('baz')

		return waitFor(serverSocket, 'baz')
	})
})
