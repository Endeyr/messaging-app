import axios from 'axios'
import { LoginFormDataType } from '../../types/Login'
import { RegisterFormDataType } from './../../types/Register'
import { UserResponseDataType, UserType } from './authTypes'

const API_URL = 'http://localhost:5174/api/user/'

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
