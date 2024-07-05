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
import Message from '../../components/Message'
import Messenger from '../../components/Messenger'
import Socket from '../../components/Socket'
import { getMessages, reset } from '../../features/message/messageSlice'
import { MessageType } from '../../features/message/messageTypes'
// @desc All of users friends, messages, ect?
// @private Must be logged in

const DashboardPage = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { user } = useAppSelector((state) => state.auth)
	const { messages, isLoading, isError, message } = useAppSelector(
		(state) => state.message
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
					</List>
				</Box>
			</Grid>
			<Grid item xs={8} height="90dvh">
				<Box display="flex" flexDirection="column" alignItems="center" gap={4}>
					<Box component="header" sx={{ fontSize: '1.2rem' }}>
						Messages
					</Box>
					<List sx={{ width: '100%', maxWidth: 360 }}>
						<ListItem alignItems="flex-start">
							<ListItemText
								primary="Title"
								secondary={
									<>
										<Typography
											component="span"
											variant="body2"
											sx={{ display: 'inline' }}
										>
											Username
										</Typography>
										{' - message here!!!'}
									</>
								}
							/>
						</ListItem>
						<ListItem alignItems="flex-start">
							<ListItemText
								primary="Title"
								secondary={
									<>
										<Typography
											component="span"
											variant="body2"
											sx={{ display: 'inline' }}
										>
											Username
										</Typography>
										{' - message here!!!'}
									</>
								}
							/>
						</ListItem>
						<ListItem alignItems="flex-start">
							<ListItemText
								primary="Title"
								secondary={
									<>
										<Typography
											component="span"
											variant="body2"
											sx={{ display: 'inline' }}
										>
											Username
										</Typography>
										{' - message here!!!'}
									</>
								}
							/>
						</ListItem>
					</List>
				</Box>
			</Grid>
		</Grid>
	)
}
export default DashboardPage
