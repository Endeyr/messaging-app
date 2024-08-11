import { Button, ListItemText, Typography } from '@mui/material'
import { useAppDispatch } from '../app/hooks'
import { deleteMessage } from '../features/message/messageSlice'
import { type MessageType } from '../features/message/messageTypes'
const Message = ({ msg }: { msg: MessageType }) => {
	const dispatch = useAppDispatch()

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
						<p>From: {msg.sent_from.username}</p>
						<p>To: {msg.sent_to?.username}</p>
						{msg.createdAt && (
							<p>
								{new Date(msg.createdAt).toLocaleString('en-US', {
									dateStyle: 'short',
									timeStyle: 'medium',
								})}
							</p>
						)}
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
