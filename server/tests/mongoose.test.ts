import { ObjectId } from 'bson'
import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { IMessage } from '../model/messages'
import { IRoom } from '../model/room'
import { IUser } from '../model/user'
import { RoleEnum } from './../types/types'

dotenv.config()

describe('insert into mongodb', () => {
	let connection: MongoClient
	let db: Db

	beforeAll(async () => {
		connection = await MongoClient.connect(
			`mongodb+srv://${process.env.mongodbUsername}:${process.env.mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`
		)
		db = connection.db()
	})

	afterAll(async () => {
		await connection.close()
	})

	beforeEach(async () => {
		await db.collection('User').deleteMany()
		await db.collection('Message').deleteMany()
		await db.collection('Room').deleteMany()
	})

	it('should insert a user into collection', async () => {
		const users = db.collection('User')

		const mockUser: IUser = {
			username: 'John',
			email: 'test@email.com',
			password: 'password',
			role: [RoleEnum.user],
		}
		await users.insertOne(mockUser)

		const insertedUser = await users.findOne({ username: 'John' })
		expect(insertedUser).toEqual(mockUser)
	})

	it('should insert a message into collection', async () => {
		const messages = db.collection('Message')

		const mockUser = new ObjectId()

		const mockMessage: IMessage = {
			sent_from: mockUser,
			sent_to: new ObjectId(),
			room: new ObjectId(),
			text: 'A test message',
			media_url: 'some_image.jpg',
		}
		await messages.insertOne(mockMessage)
		const insertedMessage = await messages.findOne({
			sent_from: mockUser,
		})
		expect(insertedMessage).toEqual(mockMessage)
	})

	it('should insert a room into collection', async () => {
		const rooms = db.collection('Room')

		const mockRoom: IRoom = {
			users: ['Aaron', 'Adam', 'John'],
		}

		await rooms.insertOne(mockRoom)
		const insertedRoom = await rooms.findOne({
			users: ['Aaron', 'Adam', 'John'],
		})
		expect(insertedRoom).toEqual(mockRoom)
	})
})
