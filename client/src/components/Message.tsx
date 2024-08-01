import { Button } from '@mui/material'
import { useAppDispatch } from '../app/hooks'
import { deleteMessage } from '../features/message/messageSlice'
import { MessageType } from '../features/message/messageTypes'
const Message = ({ msg }: { msg: MessageType }) => {
	const dispatch = useAppDispatch()
	return (
		<>
			<h2>From: {msg.sent_from.username}</h2>
			{msg.sent_to && <h4>To: {msg.sent_to.username}</h4>}
			<p>{msg.text}</p>
			{msg.createdAt && <div>{msg.createdAt.toLocaleString('en-US')}</div>}
			<Button color="error" onClick={() => dispatch(deleteMessage(msg._id))}>
				Delete
			</Button>
		</>
	)
}
export default Message
