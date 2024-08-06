import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { socket } from '../features/socket/socketService'
import {
	connectionEstablished,
	connectionLost,
	joinRoom,
} from '../features/socket/socketSlice'
import type { RoomType } from '../types/Room'

const initialRoom = {
	users: [],
	name: '',
}

const Socket = () => {
	const dispatch = useAppDispatch()
	const { user } = useAppSelector((state) => state.auth)
	const { rooms } = useAppSelector((state) => state.socket)
	const [room, setRoom] = useState<RoomType>(initialRoom)
	const [roomName, setRoomName] = useState('')
	const [isInRoom, setIsInRoom] = useState(false)

	useEffect(() => {
		socket.connect()
		return () => {
			socket.disconnect()
		}
	}, [])

	useEffect(() => {
		const onConnect = () => {
			dispatch(connectionEstablished())
		}
		const onDisconnect = () => {
			dispatch(connectionLost())
		}
		socket.on('connection', onConnect)
		socket.on('disconnection', onDisconnect)

		return () => {
			socket.off('connect', onConnect)
			socket.off('disconnect', onDisconnect)
		}
	}, [dispatch])

	const handleJoinRoom = (e: React.FormEvent) => {
		e.preventDefault()
		if (user) {
			setRoom((prev) => ({
				...prev,
				name: roomName,
				users: [...prev.users, user],
			}))
			dispatch(joinRoom({ room, user }))
		}
		setIsInRoom(true)
	}
	return (
		<>
			<div className="App">
				{user && <p>Connection Status: {user.username + ' is connected'}</p>}
				{!isInRoom && rooms.length === 0 ? (
					<>
						<form onSubmit={handleJoinRoom}>
							<input
								placeholder="Room Number..."
								value={roomName}
								onChange={(e) => {
									setRoomName(e.target.value)
								}}
							/>
							<button type="submit"> Join Room</button>
						</form>
					</>
				) : (
					<>
						{rooms.map((rm, idx) => {
							return <p key={idx}>Room: {rm.name}</p>
						})}
					</>
				)}
			</div>
		</>
	)
}
export default Socket
