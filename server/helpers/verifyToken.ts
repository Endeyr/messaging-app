import jwt from 'jsonwebtoken'

const verifyToken = (token: string): any | null => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
		return decoded
	} catch (error) {
		return null
	}
}

export default verifyToken
