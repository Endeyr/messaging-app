import { createAsyncThunk } from '@reduxjs/toolkit'
import { createAppSlice } from '../../app/createAppSlice'
import { type UserType } from '../auth/authTypes'
import socketService from './socketService'
import { type SocketStateType, type joinRoomType } from './socketTypes'

const initialState: SocketStateType = {
	isConnected: false,
	rooms: [],
	isSuccess: false,
}

// TODO need a getRooms for when a user first loads the page

export const newUser = createAsyncThunk<
	void,
	UserType,
	{ rejectValue: string }
>('socket/newUser', (user) => {
	socketService.newUser(user)
	return
})

export const joinRoom = createAsyncThunk<
	string,
	joinRoomType,
	{ rejectValue: string }
>('socket/joinRoom', (args: joinRoomType) => {
	const { room, username } = args
	socketService.joinRoom(room, username)
	return room
})

export const leaveRoom = createAsyncThunk<
	string,
	joinRoomType,
	{ rejectValue: string }
>('socket/leaveRoom', (args: joinRoomType) => {
	const { room, username } = args
	socketService.leaveRoom(room, username)
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
