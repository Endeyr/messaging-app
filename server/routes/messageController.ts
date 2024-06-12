import { NextFunction, Request, Response } from 'express'
import Message from '../model/messages'

export const getMessages = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.json({ message: 'Get all messages' })
}

export const sendMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.json({ message: 'Send a message' })
}

export const deleteMessage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.json({ message: 'Delete a message' })
}
