import mongoose, { Document } from 'mongoose'
import { RoleEnum } from '../types/types'
const { Schema, model } = mongoose

export interface IUser {
	username: string
	email: string
	password: string
	role: RoleEnum[]
}

export interface IUserDocument extends IUser, Document {
	createdAt?: Date
	updatedAt?: Date
}

const userSchema = new Schema<IUserDocument>(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: [
			{
				type: [String],
				enum: Object.values(RoleEnum),
				default: ['user'],
			},
		],
	},
	{
		timestamps: true,
	}
)

const userModel = model<IUserDocument>('User', userSchema)
export default userModel
