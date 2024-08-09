import type { PayloadAction } from '@reduxjs/toolkit'
import { createAppSlice } from '../../app/createAppSlice'
import type { MessageType } from '../message/messageTypes'
import type { ChatStateType } from './wsTypes'

const initialState: ChatStateType = {
	messages: [],
	isEstablishingConnection: false,
	isConnected: false,
}

export const chatSlice = createAppSlice({
	name: 'chat',
	initialState,
	reducers: {
		startConnecting: (state) => {
			state.isEstablishingConnection = true
		},
		connectionEstablished: (state) => {
			state.isConnected = true
			state.isEstablishingConnection = false
		},
		receiveAllMessages: (
			state,
			action: PayloadAction<{ messages: MessageType[] }>
		) => {
			state.messages = action.payload.messages
		},
		receiveMessage: (
			state,
			action: PayloadAction<{ message: MessageType }>
		) => {
			state.messages.push(action.payload.message)
		},
		submitMessage: (state, action: PayloadAction<{ text: string }>) => {
			console.log(state, action)
			return
		},
	},
})

export const chatActions = chatSlice.actions
export default chatSlice.reducer
