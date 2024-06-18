import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import Message from '../../components/Message'
import Messenger from '../../components/Messenger'
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
		<>
			<section>
				<h1>{user && user.username}</h1>
				<p>Messages Dashboard</p>
			</section>
			<Messenger />
			{isError && message && <div style={{ color: 'red' }}>{message}</div>}
			{messages &&
				messages.map((msg: MessageType) => {
					return (
						<div key={msg._id}>
							<Message msg={msg} />
						</div>
					)
				})}
		</>
	)
}
export default DashboardPage
