import supertest from 'supertest'
import app from '..'
import { RoleEnum } from '../types/types'
import {
	authToken,
	mockAdmin,
	mockMessage1,
	mockUser2,
	user2Token,
	userToken,
} from './setupFile'

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
		it('should login a current user', async () => {
			const response = await supertest(app).post('/api/user/login').send({
				email: 'mockUser@example.com',
				password: 'password1233',
			})
			expect(response.status).toBe(200)
			expect(response.body.data).toHaveProperty('token')
			expect(response.body.data.email).toBe('mockUser@example.com')
		})
		it('should update a user', async () => {
			const id = mockUser2._id
			const response = await supertest(app)
				.put(`/api/user/update/${id}`)
				.set('Authorization', `Bearer ${user2Token}`)
				.send({
					email: 'test2@example.com',
				})
			expect(response.status).toBe(200)
			expect(response.body.updatedUser.email).toBe('test2@example.com')
			expect(response.body.message).toBe('User updated successfully')
		})
		it('should get a user data', async () => {
			const id = mockAdmin._id
			const response = await supertest(app)
				.get(`/api/user/accessUser/${id}`)
				.set('Authorization', `Bearer ${authToken}`)
			expect(response.status).toBe(200)
			expect(response.body).toHaveProperty('userId')
			expect(response.body.email).toBe('mockAdmin@example.com')
		})
		it('should delete a user', async () => {
			const id = mockUser2._id
			const response = await supertest(app)
				.delete(`/api/user/delete/${id}`)
				.set('Authorization', `Bearer ${authToken}`)
			expect(response.status).toBe(200)
			expect(response.body.message).toBe('User deleted successfully')
		})
	})

	describe('Message Routes', () => {
		it('should get messages', async () => {
			const response = await supertest(app)
				.get('/message/')
				.set('Authorization', `Bearer ${userToken}`)
			expect(response.status).toBe(200)
			expect(response.body.messages).toHaveLength(2)
		})
		it('should post a message', async () => {
			const response = await supertest(app)
				.post('/message/')
				.set('Authorization', `Bearer ${userToken}`)
				.send({
					sent_to: mockAdmin,
					text: 'Per my last message',
				})
			expect(response.status).toBe(200)
			expect(response.body.message).toHaveProperty('sent_from')
			expect(response.body.message.text).toBe('Per my last message')
		})
		it('should delete a message', async () => {
			const id = mockMessage1._id
			const response = await supertest(app)
				.delete(`/message/${id}`)
				.set('Authorization', `Bearer ${userToken}`)
			expect(response.status).toBe(200)
			expect(response.body.message).toBe('Message deleted successfully')
		})
	})
})
