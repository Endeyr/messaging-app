import { NextFunction, Response } from 'express'
import messageModel from '../model/messages'
import userModel from '../model/user'
import { UserAuthRequest } from '../types/types'
import { IMessageDocument } from './../model/messages'
import { IUserDocument } from './../model/user'

// @desc Get all messages for a user
// @route GET /api/message
// @access Private
export const getMessages = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const messages: IMessageDocument[] = []
		if (!req.user) {
			return res.json({ message: 'User not found' })
		} else {
			const sentFromMessages = await messageModel.find({
				sent_from: req.user.id,
			})
			const sentToMessages = await messageModel.find({ sent_to: req.user.id })
			messages.push(...sentFromMessages)
			messages.push(...sentToMessages)
			messages.sort((a, b) => {
				if (a.createdAt && b.createdAt) {
					return a.createdAt.getTime() - b.createdAt.getTime()
				}
				return 0
			})
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
			const recipient = await userModel.findOne({ username: req.body.sent_to })
			if (!recipient) {
				return res.status(400).json({ message: 'Please add a username' })
			} else {
				const text = req.body.text as string
				const newMessage = await messageModel.create({
					sent_from: req.user,
					sent_to: recipient,
					text: text,
				})
				const message = {
					_id: newMessage._id,
					sent_from: newMessage.sent_from.username,
					sent_to: newMessage.sent_to?.username,
					text: text,
					createdAt: newMessage.createdAt,
				}
				return res.status(200).json({ message })
			}
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
		const message = await messageModel.findById(req.params.id)
		if (!message) {
			return res.status(400).json({ message: 'Message not found' })
		}
		if (!req.user?.id) {
			return res.status(401).json({ message: 'User not logged in' })
		}
		const user = await userModel.findById(req.user?.id)
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
