import { createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../app/createAppSlice'
import type { UserType } from '../auth/authTypes'
import socketService from './socketService'
import type { SocketStateType } from './socketTypes'

const initialState: SocketStateType = {
	isConnected: false,
	rooms: [],
	onlineUsers: [],
	isSuccess: false,
	isError: false,
	isLoading: true,
	message: '',
}

const user = localStorage.getItem('user')
const parsedUser = user ? (JSON.parse(user) as UserType) : null

export const listenForOnlineUsers = createAsyncThunk<
	string[],
	void,
	{ rejectValue: string }
>('socket/listenForOnlineUsers', async (_, thunkAPI) => {
	try {
		const onlineUsers: string[] = []
		socketService.usersOnline((username) => {
			onlineUsers.push(username)
		})
		return onlineUsers
	} catch (error) {
		let message: string
		if (error instanceof Error) {
			message = error.message
		} else {
			message = 'An unknown error occurred'
		}
		return thunkAPI.rejectWithValue(message)
	}
})

export const socketSlice = createAppSlice({
	name: 'socket',
	initialState,
	reducers: {
		initSocket: () => {
			return
		},
		connectionEstablished: (state) => {
			state.isConnected = true
		},
		connectionLost: (state) => {
			state.isConnected = false
		},
		reset: () => initialState,
		userOnline: () => {
			if (parsedUser) {
				socketService.userOnline(parsedUser)
			}
		},
		addOnlineUser: (state, action) => {
			if (!state.onlineUsers.includes(action.payload)) {
				state.onlineUsers.push(action.payload)
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(listenForOnlineUsers.pending, (state) => {
				state.isLoading = true
			})
			.addCase(listenForOnlineUsers.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				state.onlineUsers = action.payload
			})
			.addCase(
				listenForOnlineUsers.rejected,
				(state, action: PayloadAction<string | undefined>) => {
					state.isLoading = false
					state.isError = true
					state.message = action.payload || 'Failed to get online users'
				}
			)
	},
})

export const {
	initSocket,
	connectionEstablished,
	connectionLost,
	reset,
	userOnline,
	addOnlineUser,
} = socketSlice.actions
export default socketSlice.reducer
