import express from 'express'
import { validateData } from '../middleware/validationMiddleware'
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchemas'
import { accessUser, loginUser, registerUser } from './userController'

const userRouter = express.Router()

userRouter.post('/register', validateData(userRegistrationSchema), registerUser)
userRouter.post('/login', validateData(userLoginSchema), loginUser)
userRouter.put('/update', accessUser)
userRouter.delete('/delete', accessUser)
userRouter.get('/accessResources', accessUser)

export default userRouter
