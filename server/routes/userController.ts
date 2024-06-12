import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/user'

export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Handle user already registered
	const { username, email, password, role } = req.body
	const newUser = new User({
		username,
		email,
		password,
		role,
	})
	try {
		const existingUser = await User.findOne({ email })
		if (existingUser) {
			const error = new Error('User already registered')
			res.status(401).send(error.message)
		} else {
			await newUser.save()
		}
	} catch (err) {
		console.log(err)
		const error = err as Error
		return res.status(401).send(error.message)
	}
	let token
	try {
		token = jwt.sign(
			{
				userId: newUser.id,
				email: newUser.email,
			},
			'secretkeyappearshere',
			{ expiresIn: '1h' }
		)
	} catch (err) {
		console.log(err)
		const error = new Error('Unable to register user')
		return res.status(401).send(error.message)
	}
	res.status(201).json({
		success: true,
		message: 'User registered successfully',
		data: { userId: newUser.id, email: newUser.email, token: token },
	})
}

export const loginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	// Handle user login logic using validated data from req.body
	const { email, password } = req.body
	let existingUser
	try {
		existingUser = await User.findOne({ email })
	} catch (err) {
		console.log(err)
		const error = err as Error
		return res.status(401).send(error.message)
	}
	if (!existingUser || existingUser.password !== password) {
		const error = new Error('Incorrect email or password')
		console.log(error)
		return res.status(401).send(error.message)
	}
	let token
	try {
		token = jwt.sign(
			{
				userId: existingUser.id,
				email: existingUser.email,
			},
			'secretkeyappearshere',
			{ expiresIn: '1h' }
		)
	} catch (err) {
		console.log(err)
		const error = new Error('Incorrect email or password')
		return res.status(401).send(error.message)
	}
	res.status(200).json({
		success: true,
		message: 'User logged in successfully',
		data: {
			username: existingUser.username,
			token: token,
		},
	})
}

export const deleteUser = (req: Request, res: Response, next: NextFunction) => {
	// logic for deleting a users account
}

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
	// logic for updating a users account
}

export const accessUser = (req: Request, res: Response, next: NextFunction) => {
	if (req.headers.authorization) {
		const token = req.headers.authorization.split(' ')[1]
		if (!token) {
			res
				.status(200)
				.json({ success: false, message: 'Error Token was not provided' })
		}
		const decodedToken = jwt.verify(
			token,
			'secretkeyappearshere'
		) as jwt.JwtPayload
		if (decodedToken.userId && decodedToken.email) {
			res.status(200).json({
				success: true,
				data: {
					userId: decodedToken.userId,
					email: decodedToken.email,
				},
			})
		} else {
			res
				.status(401)
				.json({ success: false, message: 'User id or email not found' })
		}
	}
}
