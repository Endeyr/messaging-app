import { type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createAppSlice } from '../../app/createAppSlice'
import { type RootState } from '../../app/store'
import profileService from './profileService'
import type { UserDataStateType, userDataType } from './profileTypes'

const initialState: UserDataStateType = {
	userData: {
		userId: '',
		username: '',
		email: '',
		role: [],
	},
	isSuccess: false,
	isLoading: false,
	isError: false,
	message: '',
}

export const getUserData = createAsyncThunk<
	userDataType,
	string,
	{ rejectValue: string; state: RootState }
>('profile/getUserData', async (id, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
		}
		return profileService.getUserData(id, token)
	} catch (error) {
		let message: string
		if (axios.isAxiosError(error)) {
			message =
				(error.response?.data.error.message as string) ||
				error.message ||
				'An error occurred'
		} else {
			message = (error as Error).message || 'An error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const updateUserData = createAsyncThunk<
	userDataType,
	string,
	{ rejectValue: string; state: RootState }
>('profile/updateUserData', async (id, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
		}
		return profileService.updateUserData(id, token)
	} catch (error) {
		let message: string
		if (axios.isAxiosError(error)) {
			message =
				(error.response?.data.error.message as string) ||
				error.message ||
				'An error occurred'
		} else {
			message = (error as Error).message || 'An error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const deleteUser = createAsyncThunk<
	userDataType,
	string,
	{ rejectValue: string; state: RootState }
>('profile/deleteUser', async (id, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
		}
		return profileService.deleteUser(id, token)
	} catch (error) {
		let message: string
		if (axios.isAxiosError(error)) {
			message =
				(error.response?.data.error.message as string) ||
				error.message ||
				'An error occurred'
		} else {
			message = (error as Error).message || 'An error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const profileSlice = createAppSlice({
	name: 'profile',
	initialState,
	reducers: {
		reset: () => initialState,
	},
	extraReducers: (builder) => {
		builder.addCase(getUserData.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(getUserData.fulfilled, (state, action) => {
			state.isLoading = false
			state.isSuccess = true
			state.userData = action.payload
		})
		builder.addCase(
			getUserData.rejected,
			(state, action: PayloadAction<string | undefined>) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload || 'Failed to get user data'
			}
		)
		builder.addCase(updateUserData.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(updateUserData.fulfilled, (state, action) => {
			state.isLoading = false
			state.isSuccess = true
			state.userData = action.payload
		})
		builder.addCase(
			updateUserData.rejected,
			(state, action: PayloadAction<string | undefined>) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload || 'Failed to get user data'
			}
		)
		builder.addCase(deleteUser.pending, (state) => {
			state.isLoading = true
		})
		builder.addCase(deleteUser.fulfilled, (state) => {
			state.isLoading = false
			state.isSuccess = true
			state.userData = null
		})
		builder.addCase(
			deleteUser.rejected,
			(state, action: PayloadAction<string | undefined>) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload || 'Failed to get user data'
			}
		)
	},
})

export const { reset } = profileSlice.actions
export default profileSlice.reducer
