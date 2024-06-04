const http = require('http')
const { WebSocketServer } = require('ws')
const url = require('url')

const server = http.createServer()
const wsServer = new WebSocketServer({ server })
const PORT = 8000

wsServer.on('connection', (connection, request) => {
	// ws://localhost:8000?username=Alex
	const { username } = url.parse(request.url, true).query
	console.log(username)
})

server.listen(PORT, () => {
	console.log(`WebSocket server is running on port ${8000}`)
})
