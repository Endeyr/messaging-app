import { instrument } from '@socket.io/admin-ui'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import http from 'node:http'
import path from 'node:path'
import * as socketio from 'socket.io'
import messageRouter from '../routes/messageRoutes'
import userRouter from '../routes/userRoutes'
import { messageHandler } from '../socket_handlers/messageHandler'
import { roomHandler } from '../socket_handlers/roomHandler'
import { userHandler } from '../socket_handlers/userHandler'
import { mockAuthMiddleware } from '../tests/mockAuthMiddleware'
import {
	ClientToServerEventsType,
	InterServerEventsType,
	ServerToClientEventsType,
	SocketDataType,
} from '../types/socket-io'
import { CLIENT_HOST, MONGO_URI, PORT } from '../utils/config'

dotenv.config()
const app = express()
app.use(express.static(path.join(__dirname, 'build')))

const corsOptions = {
	origin: CLIENT_HOST,
	optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.options('*', cors(corsOptions))

const server: http.Server = http.createServer(app)

const io: socketio.Server = new socketio.Server<
	ClientToServerEventsType,
	ServerToClientEventsType,
	InterServerEventsType,
	SocketDataType
>(server, {
	cors: {
		origin: '*',
		optionsSuccessStatus: 200,
		methods: ['GET', 'POST'],
	},
})

instrument(io, {
	auth: false,
	mode: 'development',
})

app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
if (process.env.NODE_ENV === 'test') {
	app.use(mockAuthMiddleware)
}
app.use('/api/user', userRouter)
app.use('/message', messageRouter)

app.get('/', (req, res) => {
	res
		.status(200)
		.send(
			'Welcome to the messaging app backend. Authorized users can access the /message api endpoint.'
		)
})

const onConnection = (socket: socketio.Socket) => {
	userHandler(io, socket)
	messageHandler(io, socket)
	roomHandler(io, socket)
}

io.on('connection', (socket) => {
	onConnection(socket)
})

mongoose.connect(MONGO_URI).then(() => {
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

export default app
