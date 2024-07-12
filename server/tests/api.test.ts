import dotenv from 'dotenv'
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { describe } from 'node:test'
import supertest from 'supertest'
import app from '..'
import messageModel from '../model/messages'
import roomModel from '../model/room'
import userModel from '../model/user'
import { RoleEnum } from '../types/types'

// app.use('/message', messageRouter)
// messageRouter.get('/', protect, getMessages)
// messageRouter.post('/', protect, sendMessage)
// messageRouter.delete('/:id', protect, deleteMessage)

// app.use('/api/user', userRouter)
// userRouter.post('/register', validateData(userRegistrationSchema), registerUser)
// userRouter.post('/login', validateData(userLoginSchema), loginUser)
// userRouter.put('/update/:id', protect, updateUser)
// userRouter.delete('/delete/:id', protect, deleteUser)
// userRouter.get('/accessUser/:id', protect, accessUserData)

describe('API Tests', () => {
	describe('User Routes /api/user', () => {
		it('should register a new user', async () => {
			const response = await supertest(app)
				.post('/api/user/register')
				.send({
					username: 'test1user',
					email: 'test1@example.com',
					password: 'password1233',
					confirmPassword: 'password1233',
					role: [RoleEnum.user],
				})
			expect(response.status).toBe(201)
			expect(response.body.data).toHaveProperty('userId')
			expect(response.body.data.email).toBe('test1@example.com')
		})
		it('should login a current user', async () => {})
		it('should update a user', async () => {})
		it('should delete a user', async () => {})
		it('should get a user data', async () => {})
	})

	describe('Message Routes', () => {
		it('should', async () => {})
	})
})
