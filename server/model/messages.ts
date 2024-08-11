import mongoose, { Document } from 'mongoose'
import { IRoomDocument } from './room'
import { IUserDocument } from './user'
const { Schema, model } = mongoose

export interface IMessage {
	sent_from: IUserDocument
	sent_to?: IUserDocument
	room?: IRoomDocument
	text: string
	media_url?: string
}

export interface IMessageDocument extends IMessage, Document {
	createdAt?: Date
	updatedAt?: Date
}

const messageSchema = new Schema<IMessageDocument>(
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

const messageModel = model<IMessageDocument>('Message', messageSchema)
export default messageModel
