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
} from '../controllers/userController'

const userRouter = express.Router()

userRouter.post('/register', validateData(userRegistrationSchema), registerUser)
userRouter.post('/login', validateData(userLoginSchema), loginUser)
userRouter.put('/update/:id', protect, updateUser)
userRouter.delete('/delete/:id', protect, deleteUser)
userRouter.get('/accessUser/:id', protect, accessUserData)

export default userRouter
