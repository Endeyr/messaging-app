import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
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
	}, [user, navigate, dispatch])
	return (
		<>
			<p>{user?.username}</p>
			<div>Welcome Home</div>
		</>
	)
}
export default Home
