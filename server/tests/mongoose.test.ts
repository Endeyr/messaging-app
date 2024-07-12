import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { describe } from 'node:test'
import messageModel from '../model/messages'
import roomModel from '../model/room'
import userModel from '../model/user'
import { RoleEnum } from './../types/types'

dotenv.config()

let mongoServer: MongoMemoryServer

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create()
	const mongoUri = mongoServer.getUri()
	await mongoose.connect(mongoUri)
})

afterAll(async () => {
	await mongoose.disconnect()
	await mongoServer.stop()
})

describe('Mongoose Model Operations', () => {
	beforeEach(async () => {
		await userModel.deleteMany({})
		await messageModel.deleteMany({})
		await roomModel.deleteMany({})
	})

	describe('User Operations', () => {
		it('should insert a user into collection', async () => {
			const mockUser = new userModel({
				username: 'John',
				email: 'test@email.com',
				password: 'password',
				role: [RoleEnum.user],
			})
			const savedUser = await mockUser.save()

			expect(savedUser.username).toBe('John')
			expect(savedUser.email).toBe('test@email.com')
		})

		it('should not insert a user with duplicate email', async () => {
			const mockUser = new userModel({
				username: 'John',
				email: 'test@email.com',
				password: 'password',
				role: [RoleEnum.user],
			})
			await mockUser.save()

			const duplicateUser = new userModel({
				username: 'Jane',
				email: 'test@email.com',
				password: 'password123',
				role: [RoleEnum.user],
			})

			await expect(duplicateUser.save()).rejects.toThrow()
		})
	})

	describe('Message Operations', () => {
		it('should insert a message into collection', async () => {
			const user = await userModel.create({
				username: 'John',
				email: 'john@example.com',
				password: 'password',
				role: [RoleEnum.user],
			})

			const mockMessage = new messageModel({
				sent_from: user._id,
				text: 'A test message',
			})

			const savedMessage = await mockMessage.save()
			expect(savedMessage.text).toBe('A test message')
			expect(savedMessage.sent_from).toEqual(user._id)
		})

		it('should not insert a message without required fields', async () => {
			const invalidMessage = new messageModel({
				sent_to: new mongoose.Types.ObjectId(),
			})

			await expect(invalidMessage.save()).rejects.toThrow()
		})
	})

	describe('Room Operations', () => {
		it('should insert a room into collection', async () => {
			const mockRoom = new roomModel({
				users: ['Aaron', 'Adam', 'John'],
			})

			const savedRoom = await mockRoom.save()
			expect(savedRoom.users).toEqual(['Aaron', 'Adam', 'John'])
		})

		it('should not insert a room without users', async () => {
			const invalidRoom = new roomModel({})

			await expect(invalidRoom.save()).rejects.toThrow()
		})
	})
})
