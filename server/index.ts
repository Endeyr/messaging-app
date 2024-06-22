import bodyParser from 'body-parser'
import cors from 'cors'
import date from 'date-and-time'
import dotenv from 'dotenv'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import * as socketio from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import { CLIENT_HOST, PORT } from './config'
import messageRouter from './routes/messageRoutes'
import userRouter from './routes/userRoutes'
import { MessageType, SessionType, UserType } from './types'
import { getUniqueUsersOnlineByUsername } from './utils'

dotenv.config()
const app = express()
app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())

const server: http.Server = http.createServer(app)
const io: socketio.Server = new socketio.Server(server, {
	cors: {
		origin: CLIENT_HOST,
		methods: ['GET', 'POST'],
	},
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/api/user', userRouter)
app.use('/message', messageRouter)

let users: UserType[] = []
const messages: MessageType[] = []
let activeUserSessions: SessionType[] = []

io.on('connection', (socket) => {
	const { id } = socket
	console.log(`User Connected: ${socket.id}`)

	socket.on('new login', (user: UserType) => {
		if (
			!users.some((existingUser) => existingUser.username === user.username)
		) {
			users = [...users, user]
			io.emit('new user added', user)
		}

		socket.data.username = user.username
		activeUserSessions.push({
			session: id,
			username: user.username,
		})

		io.emit('users online', getUniqueUsersOnlineByUsername(activeUserSessions))
	})

	socket.on('join_room', (room, username) => {
		console.log(`User ${username} joined room ${room}`)
		socket.join(room)
	})

	socket.on('send_message', (message: MessageType) => {
		console.log(`message: ${message.author}: ${message.content}`)
		messages.push(message)
		socket.emit('receive_message', message)
	})

	socket.on('typing', (username: string) => {
		console.log(`User typing: ${username}`)
		io.emit('user starts typing', username)
	})

	socket.on('stopped typing', (username: string) => {
		console.log(`User stopped typing: ${username}`)
		io.emit('user stopped typing', username)
	})

	socket.on('disconnect', () => {
		console.log(`user disconnected: ${socket.data.username}`)
		activeUserSessions = activeUserSessions.filter(
			(user) => !(user.username === socket.data.username && user.session === id)
		)
		io.emit('users online', getUniqueUsersOnlineByUsername(activeUserSessions))
	})
})

mongoose
	.connect(
		`mongodb+srv://${process.env.mongodbUsername}:${process.env.mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`
	)
	.then(() => {
		server
			.listen(PORT, () => {
				console.log(`SERVER IS RUNNING ON ${PORT}`)
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
