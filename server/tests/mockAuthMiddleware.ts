import { NextFunction, Response } from 'express'
import verifyToken from '../helpers/verifyToken'
import userModel from '../model/user'
import { UserAuthRequest } from './../types/types'

export const mockAuthMiddleware = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			const token = req.headers.authorization.split(' ')[1]
			const decodedToken = verifyToken(token)
			if (!decodedToken) {
				return res.status(401).json({ message: 'Invalid token' })
			}
			const { userId } = decodedToken
			const user = await userModel.findById(userId)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}
			req.user = user
			next()
		} else {
			next()
		}
	} catch (error) {
		console.error('Error in mockAuthMiddleware:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}
