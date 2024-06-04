const http = require('http')
const { WebSocketServer } = require('ws')
const url = require('url')
const uuidv4 = require('uuid').v4

// server initialization
const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const PORT = 8000

// initialize connections + users obj
const connections = {}
const users = {}

// update state to client
const broadcastUsers = () => {
	Object.keys(connections).forEach((uuid) => {
		const connection = connections[uuid]
		const message = JSON.stringify(users)
		connection.send(message)
	})
}

// event handlers
const handleMessage = (bytes, uuid) => {
	const message = JSON.parse(bytes.toString())
	const user = users[uuid]
	// error handling + validation
	// update state
	user.state.x = message.x
	user.state.y = message.y
	// pass state to client
	broadcastUsers()
	console.log(
		`${user.username} updated their state ${JSON.stringify(user.state)}`
	)
}
// remove from connections + users obj
const handleClose = (uuid) => {
	console.log(`${users[uuid].username} disconnected`)
	delete connections[uuid]
	delete users[uuid]
	// send message that user disconnected
	broadcastUsers()
}

// ws run at start
wsServer.on('connection', (connection, request) => {
	// ws://localhost:8000?params
	const { username } = url.parse(request.url, true).query
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
