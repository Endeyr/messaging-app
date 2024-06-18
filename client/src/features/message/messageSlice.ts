import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import { MessageFormDataType } from '../../types/Message'
import messageService from './messageService'
import { MessageDeleteType, MessageType } from './messageTypes'

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
>('message/create', async (text, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
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

export const getMessages = createAsyncThunk<
	MessageType[],
	void,
	{ rejectValue: string; state: RootState }
>('message/getAll', async (_, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
		}
		return await messageService.getMessages(token)
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

export const deleteMessage = createAsyncThunk<
	MessageDeleteType,
	string,
	{ rejectValue: string; state: RootState }
>('message/delete', async (id, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
		}
		return await messageService.deleteMessage(id, token)
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
			.addCase(createText.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createText.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.messages.push(action.payload)
			})
			.addCase(createText.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})
			.addCase(getMessages.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.messages = action.payload
			})
			.addCase(getMessages.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})
			.addCase(deleteMessage.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteMessage.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.messages = state.messages.filter(
					(message) => message._id !== action.payload.id
				)
			})
			.addCase(deleteMessage.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload as string
			})
	},
})

export const { reset } = messageSlice.actions
export default messageSlice.reducer
