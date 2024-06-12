import { NextFunction, Request, Response } from 'express'
import Message from '../model/messages'
import { UserAuthRequest } from './../types'

export const getMessages = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	let messages
	if (!req.user) {
		res.json({ message: 'User not found' })
	} else {
		messages = await Message.find({ user: req.user.id })
		res.json({ messages })
	}
}

export const sendMessage = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	if (!req.body.text) {
		res.status(400)
		res.json({ message: 'Please add a text field' })
	}
	if (!req.user) {
		res.json({ message: 'User not found' })
	} else {
		const message = await Message.create({
			text: req.body.text,
			user: req.user.id,
		})
		res.status(200).json(message)
	}
}

export const deleteMessage = async (
	req: UserAuthRequest,
	res: Response,
	next: NextFunction
) => {
	res.json({ message: 'Delete a message' })
}
