import { Request } from 'express'
import { Document } from 'mongoose'
import { RoleEnum } from './schemas/userSchemas'

export type UserStateType = {
	message: string
	typing: boolean
	onlineStatus: 'online' | 'offline'
}
export type UserType = {
	username: string
	state?: UserStateType
}
export type UsersType = {
	[key: string]: UserType
}
export type MessageType = {
	room: string
	from: string
	content: string
	timestamp: string
}
export type UserAuthRequest = Request & {
	user?: IUser | null
}
export type IUser = {
	id?: string
	username?: string
	email?: string
	password?: string
	role?: RoleEnum
}
