import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../model/user'
import { RoleEnum, UserAuthRequest } from './../types'

// @desc Register new user
// @route POST /api/user/register
// @access Public
export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { username, email, password, role } = req.body
	const existingUser = await User.findOne({ email })
	if (existingUser) {
		const error = new Error('User already registered')
		return res.status(400).send(error.message)
	}
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)
	const newUser = new User({
		username,
		email,
		password: hashedPassword,
		role,
	})
	try {
		await newUser.save()
	} catch (err) {
		console.log(err)
		const error = err as Error
		return res.status(400).send(error.message)
	}
	let token
	try {
		token = jwt.sign(
			{
				userId: newUser.id,
			},
			process.env.JWT_SECRET as string,
			{ expiresIn: '30d' }
		)
	} catch (err) {
		console.log(err)
		const error = new Error('Unable to register user')
		return res.status(401).send(error.message)
	}
	return res.status(201).json({
		success: true,
		message: 'User registered successfully',
		data: { userId: newUser.id, email: newUser.email, token: token },
	})
}

// @desc Login new user
// @route POST /api/user/login
// @access Public
// TODO fix user can login with incorrect password
export const loginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body
	let existingUser
	try {
		existingUser = await User.findOne({ email })
	} catch (err) {
		console.log(err)
		const error = err as Error
		return res.status(400).send(error.message)
	}
	if (
		!existingUser ||
		(await bcrypt.compare(existingUser.password, password))
	) {
		const error = new Error('Incorrect email or password')
		console.log(error)
		return res.status(400).send(error.message)
	}
	let token
	try {
		token = jwt.sign(
			{
				userId: existingUser.id,
			},
			process.env.JWT_SECRET as string,
			{ expiresIn: '30d' }
		)
	} catch (err) {
		console.log(err)
		const error = new Error('Incorrect email or password')
		return res.status(400).send(error.message)
	}
	return res.status(200).json({
		success: true,
		message: 'User logged in successfully',
		data: {
			username: existingUser.username,
			token: token,
		},
	})
}

// @desc Delete user account
// @route POST /api/user/delete
// @access Private
export const deleteUser = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.params.id) {
			return res.status(400).json({ message: 'No id provided' })
		}
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}
		if (!req.user?.role.includes(RoleEnum.admin)) {
			return res
				.status(401)
				.json({ message: 'User not authorized to delete user' })
		}
		await user.deleteOne()
		return res
			.status(200)
			.json({ id: req.params.id, message: 'User deleted successfully ' })
	} catch (error) {
		console.error('Error deleting user:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}

// @desc Update user account
// @route PUT /api/user/update
// @access Private
export const updateUser = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.params.id) {
			return res.status(400).json({ message: 'No id provided' })
		}
		const user = await User.findById(req.params.id)
		if (!user) {
			return res.status(400).json({ message: 'User not found' })
		}
		if (req.user?.id !== user.id) {
			return res
				.status(401)
				.json({ message: 'User not authorized to update user' })
		}
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: 'Please add update fields' })
		}
		const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
		})
		return res
			.status(200)
			.json({ updatedUser, message: 'User updated successfully ' })
	} catch (error) {
		console.error('Error updating user:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}

// @desc Get user account info
// @route GET /api/user/accessUser
// @access Private
export const accessUserData = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	// logic for getting users account data, in a protected route
	try {
		const user = await User.findById(req.user?.id)
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		const { username, email, _id } = user
		return res.status(200).json({ userId: _id, username, email })
	} catch (error) {
		return next(error)
	}
}
