import axios from 'axios'
import type { ProfileFormDataType } from './../../types/Profile'
import type { userDataType } from './profileTypes'

const API_URL = `${import.meta.env.VITE_API_URL}/api/user/`

const getUserData = async (
	userId: string,
	token: string
): Promise<userDataType> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.get(API_URL + 'accessUser/' + userId, config)
	return response.data
}

const updateUserData = async (
	userData: ProfileFormDataType,
	token: string
): Promise<userDataType> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const userInfo = { username: userData.username, email: userData.email }
	const response = await axios.put(
		API_URL + 'update/' + userData.userId,
		userInfo,
		config
	)
	return response.data
}

const deleteUser = async (
	userId: string,
	token: string
): Promise<userDataType> => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.delete(API_URL + 'delete/' + userId, config)
	return response.data
}

const profileService = {
	getUserData,
	updateUserData,
	deleteUser,
}

export default profileService
