import { type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createAppSlice } from '../../app/createAppSlice'
import { type RootState } from '../../app/store'
import messageService from './messageService'
import {
	type MessageDeleteType,
	type MessageFormDataType,
	type MessageStateType,
	type MessageType,
} from './messageTypes'

const initialState: MessageStateType = {
	messages: [],
	isSuccess: false,
	isLoading: false,
	isError: false,
	message: '',
}

export const createMessage = createAsyncThunk<
	MessageType,
	MessageFormDataType,
	{ rejectValue: string; state: RootState }
>('message/create', async (messageData, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user?.token
		if (!token) {
			const tokenError = new Error('Token not found')
			return thunkAPI.rejectWithValue(tokenError.message)
		}
		return await messageService.createMessage(messageData, token)
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
				(error.response?.data.error.message as string) ||
				error.message ||
				'An error occurred'
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
				(error.response?.data.error.message as string) ||
				error.message ||
				'An error occurred'
		} else {
			message = (error as Error).message || 'An error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const messageSlice = createAppSlice({
	name: 'messages',
	initialState,
	reducers: {
		reset: () => initialState,
		messageSent: (state, action: PayloadAction<MessageType>) => {
			const existingMessage = state.messages.find(
				(msg) => msg._id === action.payload._id
			)
			if (!existingMessage) {
				state.messages.push(action.payload)
			}
		},
		socketMessageReceived: (state, action: PayloadAction<MessageType>) => {
			const existingMessage = state.messages.find(
				(msg) => msg._id === action.payload._id
			)
			if (!existingMessage) {
				state.messages.push(action.payload)
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(createMessage.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createMessage.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.messages.push(action.payload)
			})
			.addCase(
				createMessage.rejected,
				(state, action: PayloadAction<string | undefined>) => {
					state.isLoading = false
					state.isError = true
					state.message = action.payload || 'Failed to create text'
				}
			)
			.addCase(getMessages.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getMessages.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.messages = action.payload
			})
			.addCase(
				getMessages.rejected,
				(state, action: PayloadAction<string | undefined>) => {
					state.isLoading = false
					state.isError = true
					state.message = action.payload || 'Failed to get messages'
				}
			)
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
			.addCase(
				deleteMessage.rejected,
				(state, action: PayloadAction<string | undefined>) => {
					state.isLoading = false
					state.isError = true
					state.message = action.payload || 'Failed to delete message'
				}
			)
	},
})

export const { reset, messageSent, socketMessageReceived } =
	messageSlice.actions
export default messageSlice.reducer
