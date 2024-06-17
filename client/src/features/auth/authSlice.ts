import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { LoginFormDataType } from '../../types/Login'
import { RegisterFormDataType } from './../../types/Register'
import authService from './authService'
import { UserType } from './authTypes'

type InitialStateType = {
	user: UserType | null
	isError: boolean
	isSuccess: boolean
	isLoading: boolean
	message: string
}

const user = localStorage.getItem('user')
const parsedUser = user ? JSON.parse(user) : null

const initialState: InitialStateType = {
	user: parsedUser,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

export const register = createAsyncThunk<
	UserType,
	RegisterFormDataType,
	{ rejectValue: string }
>('auth/register', async (user, thunkAPI) => {
	try {
		return await authService.register(user)
	} catch (error: unknown) {
		let message: string
		if (axios.isAxiosError(error)) {
			message =
				(error.response?.data as string) || error.message || 'An error occurred'
		} else {
			message = (error as Error).message || 'An error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const login = createAsyncThunk<
	UserType,
	LoginFormDataType,
	{ rejectValue: string }
>('auth/login', async (user, thunkAPI) => {
	try {
		return await authService.login(user)
	} catch (error: unknown) {
		let message: string
		if (axios.isAxiosError(error)) {
			message =
				(error.response?.data as string) || error.message || 'An error occurred'
		} else {
			message = (error as Error).message || 'An error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const logout = createAsyncThunk('auth/logout', async () => {
	await authService.logout()
})

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset: (state) => {
			state.isError = false
			state.isSuccess = false
			state.isLoading = false
			state.message = ''
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				state.isLoading = true
			})
			.addCase(register.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.user = action.payload
			})
			.addCase(register.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
				state.user = null
			})
			.addCase(login.pending, (state) => {
				state.isLoading = true
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.user = action.payload
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
				state.user = null
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null
			})
	},
})

export const { reset } = authSlice.actions
export default authSlice.reducer
