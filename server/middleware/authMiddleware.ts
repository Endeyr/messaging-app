import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/user'
import { IUser, UserAuthRequest } from '../types/types'

export const protect = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	let token: string | undefined
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	}
	if (!token) {
		return res.status(401).json({ message: 'Not authorized, missing token' })
	}
	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as jwt.JwtPayload
		const userReq = req as UserAuthRequest
		userReq.user = (await User.findById(decoded.userId).select(
			'-password'
		)) as IUser
		if (!userReq.user) {
			return res.status(401).json({ message: 'Not authorized, user not found' })
		}
		next()
	} catch (error) {
		res.status(401).json({ message: 'Not authorized' })
	}
}
