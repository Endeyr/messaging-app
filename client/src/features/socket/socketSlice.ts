import { createSlice } from '@reduxjs/toolkit'
import { RoomAction, SocketStateType } from './socketTypes'

const initialState: SocketStateType = {
	isConnected: false,
	rooms: [],
}

const socketSlice = createSlice({
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
		joinRoom: (state, action: RoomAction) => {
			const room = action.payload.room
			if (!state.rooms.includes(room)) {
				state.rooms = state.rooms.concat(room)
			}
			return
		},
		leaveRoom: (state, action: RoomAction) => {
			const room = action.payload.room
			if (state.rooms.includes(room)) {
				state.rooms = state.rooms.filter((rm) => rm !== room)
			}
			return
		},
	},
})

export const {
	initSocket,
	connectionEstablished,
	connectionLost,
	joinRoom,
	leaveRoom,
} = socketSlice.actions
export default socketSlice.reducer
