import bodyParser from 'body-parser'
import cors from 'cors'
import date from 'date-and-time'
import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import path from 'path'
import { Server } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import User from './model/user'
import userRouter from './routes/userRoutes'
import { MessageType, UsersType } from './types'

const app = express()
const PORT = 5174
app.use(express.static(path.join(__dirname, 'build')))
app.use(cors())

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

const mongodbUsername = 'endeyr'
const mongodbPassword = 'PAxsR7exz4De6K4v'

mongoose.connect(
	`mongodb+srv://${mongodbUsername}:${mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`
)

app.post('/register', async (req, res, next) => {
	const { username, email, password, role } = req.body
	try {
		const newUser = new User({
			username: username,
			email: email,
			password: password,
			role: role,
		})
		const ret = await newUser.save()
		res.json(ret)
	} catch (error) {
		console.log(error)
		return next(error)
	}
})

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

server.listen(PORT, () => {
	console.log('SERVER IS RUNNING')
})
