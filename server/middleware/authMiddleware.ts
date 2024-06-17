import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/user'
import { IUser, UserAuthRequest } from './../types'

export const protect = async (
	req: Request,
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
			const userReq = req as UserAuthRequest
			userReq.user = (await User.findById(decoded.userId).select(
				'-password'
			)) as IUser
			next()
		} catch (error) {
			res.status(401).json({ message: 'Not authorized' })
		}
	}
	if (!token) {
		res.status(401).json({ message: 'Not authorized, missing token' })
	}
}
