import bcrypt from 'bcryptjs'
import { NextFunction, Request, Response } from 'express'
import { generateToken } from '../helpers/generateToken'
import userModel from '../model/user'
import { RoleEnum, UserAuthRequest } from '../types/types'
import { IUserDocument } from './../model/user'

// @desc Register new user
// @route POST /api/user/register
// @access Public
export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { username, email, password, role } = req.body as IUserDocument
	const existingUser = await userModel.findOne({ email })
	if (existingUser) {
		const error = new Error('User already registered')
		return res.status(401).send(error.message)
	}
	const salt = await bcrypt.genSalt(10)
	const hashedPassword = await bcrypt.hash(password, salt)
	const newUser: IUserDocument = new userModel({
		username,
		email,
		password: hashedPassword,
		role,
	})
	try {
		await newUser.save()
	} catch (err) {
		const error = err as Error
		return res.status(401).send(error.message)
	}
	let token: string
	try {
		token = generateToken(newUser)
	} catch (err) {
		const error = new Error('Unable to register user')
		return res.status(401).send(error.message)
	}
	return res.status(201).json({
		success: true,
		message: 'User registered successfully',
		data: {
			userId: newUser.id,
			email: newUser.email,
			username: newUser.username,
			role: newUser.role,
			token: token,
		},
	})
}

// @desc Login new user
// @route POST /api/user/login
// @access Public
export const loginUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body
	let existingUser
	try {
		existingUser = await userModel.findOne({ email })
	} catch (err) {
		const error = err as Error
		return res.status(401).send(error.message)
	}
	if (!existingUser) {
		const error = new Error('Incorrect email or password')
		return res.status(401).send(error.message)
	}
	const isPasswordValid = await bcrypt.compare(password, existingUser.password)
	if (!isPasswordValid) {
		const error = new Error('Incorrect email or password')
		return res.status(401).send(error.message)
	}
	let token
	try {
		token = generateToken(existingUser)
	} catch (err) {
		const error = new Error('Error generating token')
		return res.status(500).send(error.message)
	}
	return res.status(200).json({
		success: true,
		message: 'User logged in successfully',
		data: {
			userId: existingUser.id,
			email: existingUser.email,
			username: existingUser.username,
			role: existingUser.role,
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
		const userToDelete = await userModel.findById(req.params.id)
		if (!userToDelete) {
			return res.status(400).json({ message: 'User not found' })
		}
		if (!req.user?.role.includes(RoleEnum.admin)) {
			return res
				.status(401)
				.json({ message: 'User not authorized to delete user' })
		}
		await userToDelete.deleteOne()
		return res
			.status(200)
			.json({ id: req.params.id, message: 'User deleted successfully' })
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
		const userToUpdate = await userModel.findById(req.params.id)
		if (!userToUpdate) {
			return res.status(400).json({ message: 'User not found in db' })
		}
		if (!req.user) {
			return res.status(400).json({ message: 'User not found in req' })
		}
		const userId = req.user._id as string
		if (
			userId.toString() !== userToUpdate.id &&
			!req.user?.role.includes(RoleEnum.admin)
		) {
			return res
				.status(401)
				.json({ message: 'User not authorized to update user' })
		}
		if (!req.body || Object.keys(req.body).length === 0) {
			return res.status(400).json({ message: 'Please add update fields' })
		}
		const updatedUser = await userModel.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true,
			}
		)
		return res
			.status(200)
			.json({ updatedUser, message: 'User updated successfully' })
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
	try {
		if (!req.user) {
			return res.status(404).json({ message: 'User not found' })
		}
		const { username, email, _id, role } = req.user
		return res.status(200).json({ userId: _id, username, email, role })
	} catch (error) {
		return next(error)
	}
}
