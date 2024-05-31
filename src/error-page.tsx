import { Button } from '@mui/material'
import Container from '@mui/material/Container'
import { Link, useRouteError } from 'react-router-dom'

type RouteError = {
	statusText?: string
	message?: string
}

export default function ErrorPage() {
	const error = useRouteError() as RouteError
	console.error(error)

	return (
		<Container
			maxWidth={'lg'}
			sx={{
				minHeight: '100dvh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
			<Button variant="contained">
				<Link to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
					Home
				</Link>
			</Button>
		</Container>
	)
}
