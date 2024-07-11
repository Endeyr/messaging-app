import dotenv from 'dotenv'
import { Db, MongoClient } from 'mongodb'
import { IUser } from '../model/user'
import { RoleEnum } from './../types/types'

dotenv.config()

describe('insert', () => {
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

	it('should insert a doc into collection', async () => {
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
})
