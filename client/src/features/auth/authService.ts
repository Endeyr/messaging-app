import axios from 'axios'
import { type LoginFormDataType } from '../../types/Login'
import { type RegisterFormDataType } from './../../types/Register'
import { type UserResponseDataType, type UserType } from './authTypes'

const API_URL = `${import.meta.env.VITE_API_URL}/api/user/`

const register = async (userData: RegisterFormDataType): Promise<UserType> => {
	const response = await axios.post<UserResponseDataType>(
		API_URL + 'register',
		userData
	)
	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data.data))
	}

	return response.data.data
}

const login = async (userData: LoginFormDataType): Promise<UserType> => {
	const response = await axios.post<UserResponseDataType>(
		API_URL + 'login',
		userData
	)
	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data.data))
	}

	return response.data.data
}

const logout = () => {
	localStorage.removeItem('user')
}

const authService = {
	register,
	login,
	logout,
}

export default authService
