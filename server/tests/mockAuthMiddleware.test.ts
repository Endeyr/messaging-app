import supertest from 'supertest'
import app from '..'
import { authToken, user3Token } from './setupFile'

describe('Auth Operations', () => {
	it('should not allow invalid token', async () => {
		const fakeToken = 'fkjdfldsajfkldsa'
		const response = await supertest(app)
			.get('/message/')
			.set('Authorization', `Bearer ${fakeToken}`)

		expect(response.status).toBe(401)
		expect(response.body.message).toBe('Invalid token')
	})
	it('should not allow if no user found by token', async () => {
		const response = await supertest(app)
			.get('/message/')
			.set('Authorization', `Bearer ${user3Token}`)

		expect(response.status).toBe(404)
		expect(response.body.message).toBe('User not found')
	})

	it('should return error if authMiddleware failed', async () => {
		const verifyTokenSpy = jest.spyOn(
			require('../helpers/verifyToken'),
			'default'
		)

		verifyTokenSpy.mockImplementation(() => {
			throw new Error('Mocked error')
		})

		const response = await supertest(app)
			.get('/message/')
			.set('Authorization', `Bearer ${authToken}`)

		expect(response.status).toBe(500)
		expect(response.body.message).toBe('Server error')

		verifyTokenSpy.mockRestore()
	})
})
