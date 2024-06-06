import cors from 'cors'
import express from 'express'
import http from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { UsersType } from './types'

const app = express()
app.use(express.static(path.join(__dirname, '/public')))
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'http://127.0.0.1:5173',
		methods: ['GET', 'POST'],
	},
})

const users: UsersType = {}
const messages = []

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`)
	socket.on('send_username', (username) => {
		console.log(`User ${username} has joined`)
		const uuid = uuidv4()
		users[uuid] = {
			username,
			state: {
				message: '',
				typing: false,
				onlineStatus: 'offline',
			},
		}
	})

	socket.on('join_room', (room, username) => {
		console.log(`User ${username} joined room ${room}`)
		socket.join(room)
	})

	socket.on('send_message', (data) => {
		console.log(`Message from ${data.room}: ${data.message} - ${data.username}`)
		socket.to(data.room).emit('receive_message', data)
	})
})

server.listen(5174, () => {
	console.log('SERVER IS RUNNING')
})
