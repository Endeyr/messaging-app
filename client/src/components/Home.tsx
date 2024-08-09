import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	listenForOnlineUsers,
	userOnline,
} from '../features/socket/socketSlice'
const Home = () => {
	const { user } = useAppSelector((state) => state.auth)
	const { onlineUsers, isLoading, isError, message } = useAppSelector(
		(state) => state.socket
	)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		}
		dispatch(userOnline())
		dispatch(listenForOnlineUsers())
	}, [user, navigate, dispatch])

	console.log(onlineUsers)

	return (
		<>
			<p>{user?.username}</p>
			<div>Welcome Home</div>
			{!isLoading && onlineUsers.length > 0 && (
				<>
					<h2>Online Users: {onlineUsers}</h2>
					<ul>
						{onlineUsers.map((username) => (
							<li key={username}>{username}</li>
						))}
					</ul>
				</>
			)}
			{isError && <>Error: {message}</>}
		</>
	)
}
export default Home
