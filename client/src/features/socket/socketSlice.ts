import { createAsyncThunk } from '@reduxjs/toolkit'
import { createAppSlice } from '../../app/createAppSlice'
import { type UserType } from '../auth/authTypes'
import socketService from './socketService'
import type { JoinRoomType, RoomType, SocketStateType } from './socketTypes'

const initialState: SocketStateType = {
	isConnected: false,
	rooms: [],
	isSuccess: false,
	isError: false,
	message: '',
}
export const newUser = createAsyncThunk<
	void,
	UserType,
	{ rejectValue: string }
>('socket/newUser', (user) => {
	socketService.newUser(user)
	return
})

export const joinRoom = createAsyncThunk<
	RoomType,
	JoinRoomType,
	{ rejectValue: string }
>('socket/joinRoom', (args) => {
	const { room, user } = args
	socketService.joinRoom(room, user)
	return room
})

export const leaveRoom = createAsyncThunk<
	RoomType,
	JoinRoomType,
	{ rejectValue: string }
>('socket/leaveRoom', (args) => {
	const { room, user } = args
	socketService.leaveRoom(room, user)
	return room
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
	},
	extraReducers: (builder) => {
		builder
			.addCase(joinRoom.fulfilled, (state, action) => {
				state.rooms.push(action.payload)
			})
			.addCase(leaveRoom.fulfilled, (state, action) => {
				state.rooms = state.rooms.filter((rm) => rm !== action.payload)
			})
	},
})

export const { initSocket, connectionEstablished, connectionLost, reset } =
	socketSlice.actions
export default socketSlice.reducer
