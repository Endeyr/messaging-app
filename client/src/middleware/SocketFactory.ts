import { io, Socket } from 'socket.io-client'

export interface SocketInterface {
	socket: Socket
}

class SocketConnection implements SocketInterface {
	public socket: Socket
	public socketEndpoint = 'http://localhost:5174'
	constructor() {
		this.socket = io(this.socketEndpoint)
	}
}

let socketConnection: SocketConnection | undefined

class SocketFactory {
	public static create(): SocketConnection {
		if (!socketConnection) {
			socketConnection = new SocketConnection()
		}
		return socketConnection
	}
}

export default SocketFactory
