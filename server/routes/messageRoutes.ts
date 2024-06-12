import express from 'express'
import { deleteMessage, getMessages, sendMessage } from './messageController'

const messageRouter = express.Router()

messageRouter.get('/', getMessages)
messageRouter.post('/', sendMessage)
messageRouter.delete('/', deleteMessage)

export default messageRouter
