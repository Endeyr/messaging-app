import axios from 'axios'
import { LoginFormDataType } from './../types/Login'
import { RegisterFormDataType } from './../types/Register'

// TODO add bearer token to request
const API = axios.create({
	baseURL: 'http://localhost:5174/api/user',
	headers: {
		'Content-Type': 'application/json',
	},
})

export const registerUser = (userData: RegisterFormDataType) =>
	API.post('/register', userData)
export const loginUser = (userData: LoginFormDataType) =>
	API.post('/login', userData)
