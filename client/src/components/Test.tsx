import { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { MessageType } from '../types/Test'

const socket = io('http://localhost:5174')

const Test = () => {
	const [isConnected, setIsConnected] = useState(socket.connected)
	const [room, setRoom] = useState('')
	const [userMessage, setUserMessage] = useState('')
	const [messageReceived, setMessageReceived] = useState<MessageType[]>([])
	const [username, setUsername] = useState('')

	const joinRoom = () => {
		if (room !== '') {
			socket.emit('join_room', room, username)
		}
	}

	const sendMessage = () => {
		if (userMessage !== '' && room !== '' && username !== '') {
			socket.emit('send_message', {
				content: userMessage,
				room,
				from: username,
			})
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
		const handleReceiveMessage = (messages: MessageType[]) => {
			setMessageReceived(messages)
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
						setUserMessage(event.target.value)
					}}
				/>
				<button onClick={sendMessage}> Send Message</button>
				<p>Message: {userMessage}</p>
				<h1> Messages: {messageReceived.length}</h1>
				{messageReceived.map((message) => (
					<div key={message.timestamp}>
						{message.content} - {message.from} - {message.timestamp}
					</div>
				))}
			</div>
		</>
	)
}
export default Test
