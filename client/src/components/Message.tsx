import { Button, ListItemText, Typography } from '@mui/material'
import { useAppDispatch } from '../app/hooks'
import { deleteMessage } from '../features/message/messageSlice'
import { type MessageType } from '../features/message/messageTypes'
const Message = ({ msg }: { msg: MessageType }) => {
	const dispatch = useAppDispatch()

	console.log(msg)
	return (
		<>
			<ListItemText
				primary={msg.text}
				secondary={
					<Typography
						component={'span'}
						variant="body2"
						sx={{ display: 'inline' }}
					>
						<p>From: {msg.sent_from}</p>
						<p>To: {msg.sent_to}</p>
						<p>{msg.createdAt?.toLocaleString('en-US')}</p>
						<Button
							color="error"
							onClick={() => dispatch(deleteMessage(msg._id))}
						>
							Delete
						</Button>
					</Typography>
				}
			/>
		</>
	)
}
export default Message
