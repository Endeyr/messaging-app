import { Request } from 'express'
import { Document } from 'mongoose'

export type UserType = {
	username: string
	email: string
}

export type MessageType = {
	author: string
	content: string
	timestamp: string
}
export type UserAuthRequest = Request & {
	user?: IUser | null
}
export interface IUser extends Document {
	id?: string
	username: string
	email: string
	password: string
	role: RoleEnum[]
}

export enum RoleEnum {
	user = 'user',
	admin = 'admin',
	moderator = 'moderator',
}

export type SessionType = {
	username: string
	session: string
}
