import express from 'express'
import { validateData } from '../middleware/validationMiddleware'
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchemas'
import { protect } from './../middleware/authMiddleware'
import {
	accessUserData,
	deleteUser,
	loginUser,
	registerUser,
	updateUser,
} from './userController'

const userRouter = express.Router()

userRouter.post('/register', validateData(userRegistrationSchema), registerUser)
userRouter.post('/login', validateData(userLoginSchema), loginUser)
userRouter.put('/update', protect, updateUser)
userRouter.delete('/delete', protect, deleteUser)
userRouter.get('/accessUser', protect, accessUserData)

export default userRouter
