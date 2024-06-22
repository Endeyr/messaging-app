import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { socket } from '../features/socket/socketService'
import {
	connectionEstablished,
	connectionLost,
	joinRoom,
} from '../features/socket/socketSlice'

const Socket = () => {
	const dispatch = useAppDispatch()
	const { user } = useAppSelector((state) => state.auth)
	const [room, setRoom] = useState('')

	useEffect(() => {
		const onConnect = () => {
			dispatch(connectionEstablished())
		}
		const onDisconnect = () => {
			dispatch(connectionLost())
		}
		socket.on('connect', onConnect)
		socket.on('disconnect', onDisconnect)

		return () => {
			socket.off('connect', onConnect)
			socket.off('disconnect', onDisconnect)
		}
	}, [dispatch])
	return (
		<>
			<div className="App">
				{user && <p>Connection Status: {user.username + ' is connected'}</p>}
				<input
					placeholder="Room Number..."
					onChange={(event) => {
						setRoom(event.target.value)
					}}
				/>
				<button onClick={() => dispatch(joinRoom({ room }))}> Join Room</button>
			</div>
		</>
	)
}
export default Socket
