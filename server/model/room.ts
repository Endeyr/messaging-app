import mongoose, { Document } from 'mongoose'
import { IUserDocument } from './user'
const { Schema, model } = mongoose

export interface IRoom {
	users: IUserDocument[]
	name: string
}

export interface IRoomDocument extends IRoom, Document {
	createdAt?: Date
	updatedAt?: Date
}

const roomSchema = new Schema(
	{
		users: {
			type: [String],
			required: true,
			validate: {
				validator: function (v: string[]) {
					return v.length > 0
				},
				message: 'A room must have at least one user.',
			},
		},
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const roomModel = model<IRoomDocument>('Room', roomSchema)
export default roomModel
