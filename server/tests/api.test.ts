import supertest from 'supertest'
import app from '../api'
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
			it('should return if user already registered', async () => {
				const response = await supertest(app)
					.post('/api/user/register')
					.send({
						username: 'mockAdmin@example.com',
						email: 'mockAdmin@example.com',
						password: 'password1233',
						confirmPassword: 'password1233',
						role: [RoleEnum.user],
					})
				expect(response.status).toBe(400)
				const errorText = response.error as any
				expect(errorText.text).toBe('User already registered')
			})
			it('should catch error saving new user', async () => {
				const response = await supertest(app)
					.post('/api/user/register')
					.send({
						username: 'newUser@example.com',
						email: 'newUser@example.com',
						password: '',
						confirmPassword: '',
						role: [RoleEnum.user],
					})
				expect(response.status).toBe(400)
				const errorText = response.error as any
				// error is caught by the zod validate middleware
				expect(errorText.text).toBe(
					'{"errors":[{"message":"password is String must contain at least 8 character(s)"}]}'
				)
			})
			it('should catch error registering user ', async () => {
				const response = await supertest(app)
					.post('/api/user/register')
					.send({
						username: 'newUser2@example.com',
						email: 'newUser2@example.com',
						password: '',
						confirmPassword: '',
						role: [RoleEnum.user],
					})
				expect(response.status).toBe(400)
				const errorText = response.error as any
				// error is caught by the zod validate middleware
				expect(errorText.text).toBe(
					'{"errors":[{"message":"password is String must contain at least 8 character(s)"}]}'
				)
			})
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
			it('should catch error finding user from db', async () => {
				const response = await supertest(app).post('/api/user/login').send({
					email: '',
					password: 'password1233',
				})
				expect(response.status).toBe(400)
				expect(response.error).toHaveProperty('text')
			})
			it('should catch error finding user by email', async () => {
				const response = await supertest(app).post('/api/user/login').send({
					email: 'randomUser@example.com',
					password: 'password1233',
				})
				expect(response.status).toBe(400)
				expect(response.error).toHaveProperty('text')
			})
			it('should catch error if password is incorrect', async () => {
				const response = await supertest(app).post('/api/user/login').send({
					email: 'mockUser@example.com',
					password: '',
				})
				expect(response.status).toBe(400)
				expect(response.error).toHaveProperty('text')
			})
			it('should catch error generating token', async () => {
				const response = await supertest(app).post('/api/user/login').send({
					email: 'randomUser@example.com',
					password: 'password1233',
				})
				expect(response.status).toBe(400)
				expect(response.error).toHaveProperty('text')
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
		})
		describe('updateUser', () => {
			it('should catch error updating user', async () => {
				const id = mockUser2._id
				const response = await supertest(app)
					.put(`/api/user/update/${id}`)
					.set('Authorization', `Bearer ${user2Token}`)
					.send({})
				expect(response.status).toBe(400)
			})
			it('should return if id not in params', async () => {
				const response = await supertest(app)
					.put(`/api/user/update/`)
					.set('Authorization', `Bearer ${user2Token}`)
					.send({
						email: 'test2@example.com',
					})
				expect(response.status).toBe(404)
			})
			it('should return if user not found in db', async () => {
				const id = mockUser2._id
				const response = await supertest(app)
					.put(`/api/user/update/${id}`)
					.send({
						email: 'test2@example.com',
					})
				expect(response.status).toBe(401)
			})
			it('should return if user not found in request', async () => {
				const id = mockUser2._id
				const response = await supertest(app)
					.put(`/api/user/update/${id}`)
					.send({
						email: 'test2@example.com',
					})
				expect(response.status).toBe(401)
			})
			it('should return if user not authorized', async () => {
				const id = mockUser2._id
				const response = await supertest(app)
					.put(`/api/user/update/${id}`)
					.send({
						email: 'test2@example.com',
					})
				// Caught in 401 unauthorized
				expect(response.status).toBe(401)
			})
			it('should return if request missing update fields', async () => {
				const id = mockUser2._id
				const response = await supertest(app)
					.put(`/api/user/update/${id}`)
					.set('Authorization', `Bearer ${user2Token}`)
					.send({})
				expect(response.status).toBe(400)
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
		})
		describe('accessUserData', () => {
			it('should return if error accessing user data', async () => {
				const response = await supertest(app)
					.get(`/api/user/accessUser/`)
					.set('Authorization', `Bearer ${authToken}`)
				expect(response.status).toBe(404)
			})
			it('should return if user not in request', async () => {
				const id = mockAdmin._id
				const response = await supertest(app).get(`/api/user/accessUser/${id}`)
				expect(response.status).toBe(401)
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
		})
		describe('deleteUser', () => {
			it('should catch error deleting user', async () => {
				const id = '37C0BC868213E6D55BB47FCF'
				const response = await supertest(app)
					.delete(`/api/user/delete/${id}`)
					.set('Authorization', `Bearer ${authToken}`)
				expect(response.status).toBe(400)
			})
			it('should return if no id in params', async () => {
				const response = await supertest(app)
					.delete(`/api/user/delete/`)
					.set('Authorization', `Bearer ${authToken}`)
				expect(response.status).toBe(404)
			})
			it('should return if user not authorized', async () => {
				const id = mockUser2._id
				const response = await supertest(app).delete(`/api/user/delete/${id}`)
				expect(response.status).toBe(401)
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
	})

	describe('Message Routes', () => {
		describe('getMessage', () => {
			it('should return user not found', async () => {
				const response = await supertest(app).get('/message/')
				expect(response.status).toBe(401)
			})
			it('should get messages', async () => {
				const response = await supertest(app)
					.get('/message/')
					.set('Authorization', `Bearer ${userToken}`)
				expect(response.status).toBe(200)
				expect(response.body.messages).toHaveLength(2)
			})
		})
		describe('sendMessage', () => {
			it('should return if missing body text', async () => {
				const response = await supertest(app)
					.post('/message/')
					.set('Authorization', `Bearer ${userToken}`)
					.send({
						sent_to: mockAdmin,
					})
				expect(response.status).toBe(400)
			})
			it('should return if user not found', async () => {
				const response = await supertest(app).post('/message/').send({
					sent_to: mockAdmin,
					text: 'Per my last message',
				})
				expect(response.status).toBe(401)
			})
			it('should catch error sending message', async () => {
				const response = await supertest(app)
					.post('/message/')
					.set('Authorization', `Bearer ${userToken}`)
					.send({})
				expect(response.status).toBe(400)
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
		})
		describe('deleteMessage', () => {
			it('should return if missing id in params', async () => {
				const response = await supertest(app)
					.delete(`/message/`)
					.set('Authorization', `Bearer ${userToken}`)
				expect(response.status).toBe(404)
			})
			it('should return if message not found', async () => {
				const id = '37C0BC868213E6D55BB47FCF'
				const response = await supertest(app)
					.delete(`/message/${id}`)
					.set('Authorization', `Bearer ${userToken}`)
				expect(response.status).toBe(400)
			})
			it('should return if user not logged in', async () => {
				const id = mockMessage1._id
				const response = await supertest(app).delete(`/message/${id}`)
				expect(response.status).toBe(401)
			})
			it('should return if user not found', async () => {
				const id = mockMessage1._id
				const response = await supertest(app).delete(`/message/${id}`)
				expect(response.status).toBe(401)
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
})
