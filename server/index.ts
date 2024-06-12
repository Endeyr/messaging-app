import bodyParser from 'body-parser'
import cors from 'cors'
import date from 'date-and-time'
import dotenv from 'dotenv'
import express, { NextFunction } from 'express'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import userRouter from './routes/userRoutes'
import { MessageType, UsersType } from './types'

const app = express()
const PORT = 5174
app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())

dotenv.config()

const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: 'http://127.0.0.1:5173',
		methods: ['GET', 'POST'],
	},
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api/user', userRouter)

const users: UsersType = {}
const messages: MessageType[] = []

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
		console.log(`Message from ${data.room}: ${data.content} - ${data.from}}`)
		messages.push({
			room: data.room,
			content: data.content,
			from: data.from,
			timestamp: date.format(new Date(), 'HH:mm:ss DD/MM/YYYY'),
		})
		const roomMessages = messages.filter(
			(message) => message.room === data.room
		)
		socket.to(data.room).emit('receive_message', roomMessages)
	})
})

mongoose
	.connect(
		`mongodb+srv://${process.env.mongodbUsername}:${process.env.mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`
	)
	.then(() => {
		server
			.listen(PORT, () => {
				console.log('SERVER IS RUNNING')
			})
			// Fix for error EADDRINUSE
			.on('error', function (err) {
				process.once('SIGUSR2', function () {
					process.kill(process.pid, 'SIGUSR2')
				})
				process.on('SIGINT', function () {
					// this is only called on ctrl+c, not restart
					process.kill(process.pid, 'SIGINT')
				})
			})
	})
