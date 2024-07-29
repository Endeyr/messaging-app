import { IRoomDocument } from './../model/room'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import messageModel from '../model/messages'
import roomModel from '../model/room'
import userModel, { IUserDocument } from '../model/user'
import { RoleEnum } from '../types/types'
import { generateToken } from './../helpers/generateToken'
import { IMessageDocument } from './../model/messages'

dotenv.config()
let mongoServer: MongoMemoryServer
export let mockUser: IUserDocument
export let mockUser2: IUserDocument
export let mockUser3: IUserDocument
export let mockAdmin: IUserDocument
export let authToken: string
export let userToken: string
export let user2Token: string
export let user3Token: string
export let mockMessage1: IMessageDocument
export let mockMessage2: IMessageDocument
export let mockRoom: IRoomDocument
let isSetup = false

beforeAll(async () => {
	try {
		process.env.NODE_ENV = 'test'
		await mongoose.disconnect()
		mongoServer = await MongoMemoryServer.create()
		const mongoUri = mongoServer.getUri()
		await mongoose.connect(mongoUri)

		const salt = await bcrypt.genSalt(10)
		const hashedPassword = await bcrypt.hash('password1233', salt)
		mockAdmin = new userModel({
			username: 'mockAdmin',
			email: 'mockAdmin@example.com',
			password: hashedPassword,
			role: [RoleEnum.admin],
		})
		await mockAdmin.save()

		mockUser = new userModel({
			username: 'mockUser',
			email: 'mockUser@example.com',
			password: hashedPassword,
			role: [RoleEnum.user],
		})
		await mockUser.save()

		mockUser2 = new userModel({
			username: 'mockUser2',
			email: 'mockUser2@example.com',
			password: hashedPassword,
			role: [RoleEnum.user],
		})
		await mockUser2.save()

		mockUser3 = new userModel({
			username: 'mockUser3',
			email: 'mockUser3@example.com',
			password: hashedPassword,
			role: [RoleEnum.user],
		})

		authToken = generateToken(mockAdmin)
		userToken = generateToken(mockUser)
		user2Token = generateToken(mockUser2)
		user3Token = generateToken(mockUser3)

		mockMessage1 = new messageModel({
			sent_from: mockUser,
			sent_to: mockAdmin,
			text: 'Here is a message',
		})
		await mockMessage1.save()

		mockMessage2 = new messageModel({
			sent_from: mockUser,
			sent_to: mockAdmin,
			text: 'Here is a second message',
		})
		await mockMessage2.save()

		mockRoom = new roomModel({
			users: [mockUser, mockUser2],
			name: 'test-room',
		})

		await mockRoom.save()

		isSetup = true
	} catch (error) {
		console.error('Error in beforeAll setup:', error)
		process.exit(1)
	}
}, 20000)

afterAll(async () => {
	if (!isSetup) {
		console.error('Error in setup', isSetup)
		process.exit(1)
	}
	try {
		await userModel.deleteMany({})
		await messageModel.deleteMany({})
		await roomModel.deleteMany({})
		await mongoose.disconnect()
		await mongoServer.stop()
	} catch (error) {
		console.error('Error in afterAll teardown', error)
		process.exit(1)
	}
})
