import jwt from 'jsonwebtoken'
import verifyToken from '../helpers/verifyToken'

jest.mock('jsonwebtoken')

describe('verifyToken', () => {
	const mockJwtSecret = 'test-secret'
	const mockToken = 'valid-token'
	const mockDecodedToken = { userId: '123', username: 'testUser' }

	beforeEach(() => {
		process.env.JWT_SECRET = mockJwtSecret
		process.env.NODE_ENV = 'test'
	})

	afterEach(() => {
		jest.resetAllMocks()
	})

	it('should return decoded token when token is valid', () => {
		;(jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken)

		const result = verifyToken(mockToken)

		expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockJwtSecret)
		expect(result).toEqual(mockDecodedToken)
	})

	it('should return null when token is invalid', () => {
		;(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new Error('Invalid token')
		})

		const result = verifyToken(mockToken)

		expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockJwtSecret)
		expect(result).toBeNull()
	})

	it('should not log error when NODE_ENV is test', () => {
		const consoleSpy = jest.spyOn(console, 'error')
		;(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new Error('Invalid token')
		})

		verifyToken(mockToken)

		expect(consoleSpy).not.toHaveBeenCalled()
	})

	it('should log error when NODE_ENV is not test', () => {
		process.env.NODE_ENV = 'development'
		const consoleSpy = jest.spyOn(console, 'error')
		;(jwt.verify as jest.Mock).mockImplementation(() => {
			throw new Error('Invalid token')
		})

		verifyToken(mockToken)

		expect(consoleSpy).toHaveBeenCalledWith(
			'Error verifying token:',
			expect.any(Error)
		)
	})
})
