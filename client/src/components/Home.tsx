// import { Button } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
// import { WebSocketActionType } from '../middleware/socketMiddleware'
const Home = () => {
	const { user } = useAppSelector((state) => state.auth)
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		} else {
			navigate('/dashboard')
		}
		// else {
		// 	dispatch({ type: WebSocketActionType.WS_CONNECT })
		// }

		// return () => {
		// 	dispatch({ type: WebSocketActionType.WS_DISCONNECT })
		// }
	}, [user, navigate, dispatch])

	// const sendMessage = (message: string) => {
	// 	dispatch({ type: WebSocketActionType.SEND_MESSAGE, payload: message })
	// }

	return (
		<>
			<p>{user?.username}</p>
			<div>Welcome Home</div>
			{/* <Button onClick={() => sendMessage('Hello, WebSocket!')}>Test WS</Button> */}
		</>
	)
}
export default Home
