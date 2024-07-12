import { Request } from 'express'
import { IUserDocument } from './../model/user'

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
	user?: IUserDocument | null
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
