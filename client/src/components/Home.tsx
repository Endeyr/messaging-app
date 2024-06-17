import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
const Home = () => {
	const { user } = useAppSelector((state) => state.auth)
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			navigate('/authentication/login')
		}
	}, [user, navigate])

	return (
		<>
			<p>{user && user.username}</p>
			<div>Welcome Home</div>
		</>
	)
}
export default Home
