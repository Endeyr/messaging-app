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
		describe('registerUser', () => {
			it('should return if user already registered', () => {})
			it('should catch error saving new user', () => {})
			it('should catch error registering user ', () => {})
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
		})
		describe('loginUser', () => {
			it('should catch error finding user from db', () => {})
			it('should catch error finding user by email', () => {})
			it('should catch error if password is incorrect', () => {})
			it('should catch error generating token', () => {})
			it('should login a current user', async () => {
				const response = await supertest(app).post('/api/user/login').send({
					email: 'mockUser@example.com',
					password: 'password1233',
				})
				expect(response.status).toBe(200)
				expect(response.body.data).toHaveProperty('token')
				expect(response.body.data.email).toBe('mockUser@example.com')
			})
		})
		describe('updateUser', () => {
			it('should catch error updating user', () => {})
			it('should return if id not in params', () => {})
			it('should return if user not found in db', () => {})
			it('should return if user not found in request', () => {})
			it('should return if user not authorized', () => {})
			it('should return if request missing update fields', () => {})
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
		})
		describe('accessUserData', () => {
			it('should return if error accessing user data', () => {})
			it('should return if user not in request', () => {})
			it('should get a user data', async () => {
				const id = mockAdmin._id
				const response = await supertest(app)
					.get(`/api/user/accessUser/${id}`)
					.set('Authorization', `Bearer ${authToken}`)
				expect(response.status).toBe(200)
				expect(response.body).toHaveProperty('userId')
				expect(response.body.email).toBe('mockAdmin@example.com')
			})
		})
		describe('deleteUser', () => {
			it('should catch error deleting user', () => {})
			it('should return if no id in params', () => {})
			it('should return if user not authorized', () => {})
			it('should delete a user', async () => {
				const id = mockUser2._id
				const response = await supertest(app)
					.delete(`/api/user/delete/${id}`)
					.set('Authorization', `Bearer ${authToken}`)
				expect(response.status).toBe(200)
				expect(response.body.message).toBe('User deleted successfully')
			})
		})
	})

	describe('Message Routes', () => {
		describe('getMessage', () => {
			it('should return user not found', () => {})
			it('should return 0 on sort', () => {})
			it('should catch error fetching messages', () => {})
			it('should get messages', async () => {
				const response = await supertest(app)
					.get('/message/')
					.set('Authorization', `Bearer ${userToken}`)
				expect(response.status).toBe(200)
				expect(response.body.messages).toHaveLength(2)
			})
		})
		describe('sendMessage', () => {
			it('should return if missing body text', () => {})
			it('should return if user not found', () => {})
			it('should catch error sending message', () => {})
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
		})
		describe('deleteMessage', () => {
			it('should return if missing id in params', () => {})
			it('should return if message not found', () => {})
			it('should return if user not logged in', () => {})
			it('should return if user not found', () => {})
			it('should catch error deleting message', () => {})
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
})
