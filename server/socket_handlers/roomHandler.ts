import { type Server, type Socket } from 'socket.io'
import roomModel from '../model/room'
import { IRoomDocument } from './../model/room'
import { type IUserDocument } from './../model/user'

export const roomHandler = (io: Server, socket: Socket) => {
	const getRooms = async (user: IUserDocument) => {
		const rooms: IRoomDocument[] = await roomModel.find({
			user,
		})
		socket.emit('user-rooms', rooms)
	}

	socket.on('get-rooms', getRooms)
}
