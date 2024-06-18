import { Button } from '@mui/material'
import { MessageType } from '../features/message/messageTypes'
import { useAppDispatch } from '../app/hooks'
import { deleteMessage } from '../features/message/messageSlice'
const Message = ({ msg }: { msg: MessageType }) => {
	const dispatch = useAppDispatch()
	return (
		<>
			<h2>From: {msg.sender}</h2>
			<h4>To: {msg.recipient}</h4>
			<p>{msg.text}</p>
			<div>{new Date(msg.createdAt).toLocaleString('en-US')}</div>
			<Button color="error" onClick={() => dispatch(deleteMessage(msg._id))}>
				Delete
			</Button>
		</>
	)
}
export default Message
