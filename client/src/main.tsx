import '@fontsource/roboto'
import { ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import ErrorPage from './error-page.tsx'
import './index.css'
import ForgotPasswordOrEmail from './routes/authorization/Forgot-Password-Or-Email.tsx'
import Login from './routes/authorization/Login.tsx'
import Logout from './routes/authorization/Logout.tsx'
import Register from './routes/authorization/Register.tsx'
import Root from './routes/root.tsx'
import Profile from './routes/user/Profile.tsx'
import theme from './theme.ts'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '',
				element: <App />,
			},
			{
				path: 'authentication/register',
				element: <Register />,
			},
			{
				path: 'authentication/login',
				element: <Login />,
			},
			{
				path: 'authentication/logout',
				element: <Logout />,
			},
			{
				path: 'authentication/forgot-password-or-email',
				element: <ForgotPasswordOrEmail />,
			},
			{
				path: 'user/profile',
				element: <Profile />,
			},
		],
	},
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<CssBaseline />
		<ThemeProvider theme={theme}>
			<RouterProvider router={router} />
		</ThemeProvider>
	</React.StrictMode>
)
