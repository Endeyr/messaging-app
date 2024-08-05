import { type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { createAppSlice } from '../../app/createAppSlice'
import { type RootState } from '../../app/store'
import { type MessageFormDataType } from '../../types/Message'
import messageService from './messageService'
import {
	type MessageDeleteType,
	type MessageStateType,
	type MessageType,
} from './messageTypes'

const initialState: MessageStateType = {
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
			.addCase(createText.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createText.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.messages.push(action.payload)
			})
			.addCase(
				createText.rejected,
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
