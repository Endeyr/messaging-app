import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Root = () => {
	return (
		<>
			<Navbar />
			<Container
				maxWidth={'lg'}
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					flexDirection: 'column',
					minHeight: '90dvh',
				}}
			>
				<Outlet />
			</Container>
		</>
	)
}
export default Root
