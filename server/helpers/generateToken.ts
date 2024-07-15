import jwt from 'jsonwebtoken'
import { IUserDocument } from '../model/user'

export const generateToken = (user: IUserDocument) => {
	const token = jwt.sign(
		{
			userId: user._id,
		},
		process.env.JWT_SECRET as string,
		{ expiresIn: '30d' }
	)
	return token
}
