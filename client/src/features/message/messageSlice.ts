import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { MessageFormDataType } from '../../types/Message'
import messageService from './messageService'
import { MessageType } from './messageTypes'

type initialStateType = {
	messages: MessageType[]
	isError: boolean
	isSuccess: boolean
	isLoading: boolean
	message: string
}

const initialState: initialStateType = {
	messages: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

export const createText = createAsyncThunk<
	MessageType,
	MessageFormDataType,
	{ rejectValue: string; state: RootState }
>('auth/register', async (text, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			throw new Error('Token not found')
		}
		return await messageService.createText(text, token)
	} catch (error) {
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

export const messageSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		reset: () => initialState,
	},
	extraReducers: (builder) => {
		builder
	},
})

export const { reset } = messageSlice.actions
export default messageSlice.reducer
