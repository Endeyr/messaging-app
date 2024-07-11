import { ObjectId } from 'bson'
import mongoose from 'mongoose'
import { RoleEnum } from '../types/types'
const { Schema, model } = mongoose

export interface IUser {
	_id?: ObjectId
	username: string
	email: string
	password: string
	role: RoleEnum[]
	createdAt?: Date
	updatedAt?: Date
}

const userSchema = new Schema(
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

const User = model<IUser>('User', userSchema)
export default User
