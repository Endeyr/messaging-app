import mongoose, { Document } from 'mongoose'
const { Schema, model } = mongoose

export interface IRoom extends Document {
	id?: string
	users: string[]
	createdAt?: Date
	updatedAt?: Date
}

const roomSchema = new Schema(
	{
		// _id
		users: {
			type: [String],
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Room = model<IRoom>('Room', roomSchema)
export default Room
