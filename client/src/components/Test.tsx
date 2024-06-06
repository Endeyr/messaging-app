import { useEffect, useState } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:5174')

const Test = () => {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const [room, setRoom] = useState('')
	const [message, setMessage] = useState('')
	const [messageReceived, setMessageReceived] = useState('')
	const [username, setUsername] = useState('')

	const joinRoom = () => {
		if (room !== '') {
			socket.emit('join_room', room, username)
		}
	}

	const sendMessage = () => {
		if (message !== '' && room !== '' && username !== '') {
			socket.emit('send_message', { message, room, username })
		}
	}

	const sendUsername = () => {
		if (username !== '') {
			socket.emit('send_username', username)
		}
	}

	useEffect(() => {
		const onConnect = () => {
			setIsConnected(true)
		}
		const onDisconnect = () => {
			setIsConnected(false)
		}
		const handleReceiveMessage = (data: {
			message: string
			username: string
		}) => {
			setMessageReceived(`${data.message} from: ${data.username}`)
		}
		socket.on('connect', onConnect)
		socket.on('disconnect', onDisconnect)
		socket.on('receive_message', handleReceiveMessage)

		return () => {
			socket.off('connect', onConnect)
			socket.off('disconnect', onDisconnect)
			socket.off('receive_message', handleReceiveMessage)
		}
	}, [])
	return (
		<>
			<div className="App">
				<p>Connection Status: {'' + isConnected}</p>
				<input
					placeholder="username"
					onChange={(event) => {
						setUsername(event.target.value)
					}}
				/>
				<button onClick={sendUsername}> Set Username</button>
				<input
					placeholder="Room Number..."
					onChange={(event) => {
						setRoom(event.target.value)
					}}
				/>
				<button onClick={joinRoom}> Join Room</button>
				<input
					placeholder="Message..."
					onChange={(event) => {
						setMessage(event.target.value)
					}}
				/>
				<button onClick={sendMessage}> Send Message</button>
				<p>Message: {message}</p>
				<h1> Message:</h1>
				{messageReceived}
			</div>
		</>
	)
}
export default Test
