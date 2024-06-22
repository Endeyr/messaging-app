import type { PayloadAction } from '@reduxjs/toolkit'

export type SocketStateType = {
	isConnected: boolean
	rooms: string[]
}
export type RoomAction = PayloadAction<{
	room: string
}>
