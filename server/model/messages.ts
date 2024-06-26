import mongoose from 'mongoose'
const { Schema, model } = mongoose

const messageSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		text: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

const Message = model('Message', messageSchema)
export default Message
