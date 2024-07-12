import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface IRoom {
	users: string[]
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
	},
	{
		timestamps: true,
	}
)

const roomModel = model<IRoomDocument>('Room', roomSchema)
export default roomModel
