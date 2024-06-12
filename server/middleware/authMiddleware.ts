import { NextFunction, RequestHandler, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/user'
import { UserAuthRequest } from './../types'

export const protect: RequestHandler = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET as string
			) as jwt.JwtPayload
			req.user = await User.findById(decoded.userId).select('-password')
			next()
		} catch (error) {
			console.log(error)
			res.status(401).json({ message: 'Not authorized' })
		}
	}
	if (!token) {
		res.status(401).json({ message: 'Not authorized, missing token' })
	}
}
