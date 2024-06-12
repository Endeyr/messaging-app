import express from 'express'
import { protect } from '../middleware/authMiddleware'
import { deleteMessage, getMessages, sendMessage } from './messageController'

const messageRouter = express.Router()

messageRouter.get('/', protect, getMessages)
messageRouter.post('/:id', protect, sendMessage)
messageRouter.delete('/:id', protect, deleteMessage)

export default messageRouter
