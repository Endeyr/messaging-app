import express from 'express'
import http from 'http'
import path from 'path'
import url from 'url'
import { v4 as uuidv4 } from 'uuid'
import { RawData, WebSocket, WebSocketServer } from 'ws'

// server initialization
const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const PORT = 8000

// initialize express
const app = express()
app.use(express.static(path.join(__dirname, '/public')))

// define types
type UserStateType = {
	x: number
	y: number
}

type UserType = {
	username: string
	state: UserStateType
}

type ConnectionsType = {
	[key: string]: WebSocket
}

type UsersType = {
	[key: string]: UserType
}

// initialize connections + users obj
const connections: ConnectionsType = {}
const users: UsersType = {}

// update state to client
const broadcastUsers = (): void => {
	Object.keys(connections).forEach((uuid) => {
		const connection = connections[uuid]
		const message = JSON.stringify(users)
		connection.send(message)
	})
}

// event handlers
const handleMessage = (bytes: RawData, uuid: string): void => {
	const message = JSON.parse(bytes.toString()) as UserStateType
	const user = users[uuid]
	// error handling + validation
	if (message.x !== undefined && message.y !== undefined) {
		// update state
		user.state.x = message.x
		user.state.y = message.y
		// pass state to client
		broadcastUsers()
		console.log(
			`${user.username} updated their state ${JSON.stringify(user.state)}`
		)
	}
}
// remove from connections + users obj
const handleClose = (uuid: string): void => {
	console.log(`${users[uuid].username} disconnected`)
	delete connections[uuid]
	delete users[uuid]
	// send message that user disconnected
	broadcastUsers()
}

// ws run at start
wsServer.on('connection', (connection: WebSocket, request) => {
	// ws://localhost:8000?params
	const { query } = url.parse(request.url!, true)
	const username = query.username as string
	const uuid = uuidv4()
	// broadcast
	connections[uuid] = connection

	users[uuid] = {
		username: username,
		state: {
			x: 0,
			y: 0,
			// typing: true,
			// onlineStatus: "online",
		},
	}

	connection.on('message', (message) => handleMessage(message, uuid))
	connection.on('close', () => handleClose(uuid))
})

server.listen(PORT, () => {
	console.log(`WebSocket server is running on port ${8000}`)
})
