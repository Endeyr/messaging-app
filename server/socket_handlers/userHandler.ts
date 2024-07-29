import { type Server, type Socket } from 'socket.io'

export const userHandler = (io: Server, socket: Socket): void => {
	const example = () => {
		// logic
	}

	socket.on('example', example)
}
