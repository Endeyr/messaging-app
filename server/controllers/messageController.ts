import { NextFunction, Response } from 'express'
import Message from '../model/messages'
import User from '../model/user'
import { RoleEnum, UserAuthRequest } from '../types/types'

// @desc Get all messages for a user
// @route GET /api/message
// @access Private
export const getMessages = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		let messages
		if (!req.user) {
			return res.json({ message: 'User not found' })
		} else {
			messages = await Message.find({ user: req.user.id })
			return res.json({ messages })
		}
	} catch (error) {
		console.error('Error fetching messages:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}

// @desc Send message from user
// @route POST /api/message
// @access Private
export const sendMessage = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.body.text) {
			return res.status(400).json({ message: 'Please add a text field' })
		}
		if (!req.user) {
			return res.status(401).json({ message: 'User not found' })
		} else {
			// TODO update Message based on model
			const message = await Message.create({
				text: req.body.text,
				user: req.user.id,
			})
			return res.status(200).json(message)
		}
	} catch (error) {
		console.error('Error sending message:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}

// @desc Delete message from user
// @route DELETE /api/message/:id
// @access Private
export const deleteMessage = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.params.id) {
			return res.status(400).json({ message: 'No id provided' })
		}
		const message = await Message.findById(req.params.id)
		if (!message) {
			return res.status(400).json({ message: 'Message not found' })
		}
		if (!req.user?.id) {
			return res.status(401).json({ message: 'User not logged in' })
		}
		const user = await User.findById(req.user?.id)
		if (!user) {
			return res.status(401).json({ message: 'User not found' })
		}
		// TODO only allow mods + admin to delete messages
		// if (
		// 	!req.user?.role.includes(RoleEnum.moderator) ||
		// 	!req.user?.role.includes(RoleEnum.admin)
		// ) {
		// 	return res
		// 		.status(401)
		// 		.json({ message: 'User not authorized to delete message' })
		// }
		await message?.deleteOne()
		return res
			.status(200)
			.json({ id: req.params.id, message: 'Message deleted successfully' })
	} catch (error) {
		console.error('Error deleting message:', error)
		return res.status(500).json({ message: 'Server error' })
	}
}
