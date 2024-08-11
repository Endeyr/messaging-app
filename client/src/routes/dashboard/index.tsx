import { Box, Grid, List, ListItem } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Message from '../../components/Message'
import Messenger from '../../components/Messenger'
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
		console.log(message)
	}

	return (
		<Grid container spacing={1} sx={{ marginTop: '8px' }}>
			<Grid item xs={12} height="90dvh">
				<Box display="flex" flexDirection="column" alignItems="center" gap={4}>
					<Box component="h2" sx={{ fontSize: '1.2rem' }}>
						Messages
					</Box>
					<List sx={{ width: '100%', maxWidth: 360 }}>
						{messages.length > 0 &&
							messages.map((msg) => (
								<ListItem key={msg._id} alignItems="flex-start">
									<Message msg={msg} />
								</ListItem>
							))}
					</List>
				</Box>
				<Box display="flex" flexDirection="column" alignItems="center" gap={4}>
					<Messenger />
				</Box>
			</Grid>
		</Grid>
	)
}
export default DashboardPage
