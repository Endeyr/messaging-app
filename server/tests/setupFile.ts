import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import messageModel from '../model/messages'
import roomModel from '../model/room'
import userModel from '../model/user'

dotenv.config()
let mongoServer: MongoMemoryServer

beforeAll(async () => {
	await mongoose.disconnect()
	mongoServer = await MongoMemoryServer.create()
	const mongoUri = mongoServer.getUri()
	await mongoose.connect(mongoUri)
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongoServer.stop()
})

beforeEach(async () => {
	await userModel.deleteMany({})
	await messageModel.deleteMany({})
	await roomModel.deleteMany({})
})

afterEach(async () => {
	await userModel.deleteMany({})
	await messageModel.deleteMany({})
	await roomModel.deleteMany({})
})
