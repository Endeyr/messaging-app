import {
	Box,
	Grid,
	List,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getMessages, reset } from '../../features/message/messageSlice'
// @desc All of users friends, messages, ect?
// @private Must be logged in

const DashboardPage = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { user } = useAppSelector((state) => state.auth)
	const { messages, isLoading, isError, message } = useAppSelector(
		(state) => state.messages
	)

	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		} else {
			dispatch(getMessages())
		}

		return () => {
			dispatch(reset())
		}
	}, [user, navigate, dispatch])

	if (isLoading) {
		return <div>...Loading</div>
	}

	if (isError) {
		return <div>Error: {message}</div>
	}

	return (
		<Grid container spacing={2} sx={{ marginTop: '8px' }}>
			<Grid item xs={4} height="90dvh">
				<Box display="flex" flexDirection="column" alignItems="center" gap={4}>
					<Box component="header" sx={{ fontSize: '1.2rem' }}>
						Rooms
					</Box>
					<List sx={{ width: '100%', maxWidth: 360 }}>
						<ListItem alignItems="flex-start">
							<ListItemText primary="Room Number" />
						</ListItem>
						<ListItem alignItems="flex-start">
							<ListItemText primary="Room Number" />
						</ListItem>
						<ListItem alignItems="flex-start">
							<ListItemText primary="Room Number" />
						</ListItem>
						{/* TODO Get and display rooms */}
					</List>
				</Box>
			</Grid>
			<Grid item xs={8} height="90dvh">
				<Box display="flex" flexDirection="column" alignItems="center" gap={4}>
					<Box component="header" sx={{ fontSize: '1.2rem' }}>
						Messages
					</Box>
					<List sx={{ width: '100%', maxWidth: 360 }}>
						{messages &&
							messages.map((msg) => (
								<ListItem alignItems="flex-start">
									<ListItemText
										primary={msg.text}
										secondary={
											<>
												<Typography
													component="span"
													variant="body2"
													sx={{ display: 'inline' }}
												>
													From: {msg.sent_from.username}
												</Typography>
											</>
										}
									/>
								</ListItem>
							))}
					</List>
				</Box>
			</Grid>
		</Grid>
	)
}
export default DashboardPage
