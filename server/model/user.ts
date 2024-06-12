import mongoose from 'mongoose'
import { IUser, RoleEnum } from '../types'
const { Schema, model } = mongoose

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
