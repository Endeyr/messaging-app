import { NextFunction, Response } from 'express'
import Message from '../model/messages'
import User from '../model/user'
import { UserAuthRequest } from './../types'

export const getMessages = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	let messages
	if (!req.user) {
		return res.json({ message: 'User not found' })
	} else {
		messages = await Message.find({ user: req.user.id })
		return res.json({ messages })
	}
}

export const sendMessage = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	if (!req.body.text) {
		return res.status(400).json({ message: 'Please add a text field' })
	}
	if (!req.user) {
		return res.status(401).json({ message: 'User not found' })
	} else {
		const message = await Message.create({
			text: req.body.text,
			user: req.user.id,
		})
		return res.status(200).json(message)
	}
}

export const deleteMessage = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
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
	if (message?.user.toString() !== user?.id) {
		return res
			.status(401)
			.json({ message: 'User not authorized to delete message' })
	} else {
		await message?.deleteOne()
		return res
			.status(200)
			.json({ id: req.params.id, message: 'Message deleted successfully' })
	}
}
