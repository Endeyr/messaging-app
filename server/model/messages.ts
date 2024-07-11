import { ObjectId } from 'bson'
import mongoose from 'mongoose'
const { Schema, model } = mongoose

export interface IMessage {
	id?: ObjectId
	sent_from: ObjectId
	sent_to?: ObjectId
	room?: ObjectId
	text: string
	media_url?: string
	createdAt?: Date
	updatedAt?: Date
}

const messageSchema = new Schema(
	{
		sent_from: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		sent_to: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		room: {
			type: Schema.Types.ObjectId,
			ref: 'Room',
		},
		text: {
			type: String,
			required: true,
		},
		media_url: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

const Message = model<IMessage>('Message', messageSchema)
export default Message
