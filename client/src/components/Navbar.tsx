import AdbIcon from '@mui/icons-material/Adb'
import MenuIcon from '@mui/icons-material/Menu'
import {
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	Link,
	Menu,
	MenuItem,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logout, reset } from '../features/auth/authSlice'
type LinkType = {
	id: number
	name: string
	route?: string
}
const pages: LinkType[] = []
const loggedInSettings: LinkType[] = [
	{ id: 1, name: 'Dashboard', route: 'dashboard' },
	{ id: 2, name: 'Profile', route: 'user/profile' },
	{ id: 3, name: 'Logout' },
]
const loggedOutSettings: LinkType[] = [
	{ id: 1, name: 'Register', route: 'authentication/register' },
	{ id: 2, name: 'Login', route: 'authentication/login' },
]
const Navbar = () => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const { user } = useAppSelector((state) => state.auth)
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
	const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}
	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	const handleCloseUserMenu = () => {
		setAnchorElUser(null)
	}

	const onLogout = () => {
		if (user) {
			dispatch(logout())
			dispatch(reset())
			navigate('/')
		}
	}
	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					{/* Desktop Nav */}
					<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
					<Typography
						component={'div'}
						variant="h6"
						noWrap
						sx={{
							mr: 2,
							display: { xs: 'none', md: 'flex' },
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
						}}
					>
						<Link
							component={RouterLink}
							to={'/'}
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							LOGO
						</Link>
					</Typography>
					{/* Mobile Nav */}
					<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{ display: { xs: 'block', md: 'none' } }}
						>
							{pages.map((page) => (
								<MenuItem key={page.id} onClick={handleCloseNavMenu}>
									<Typography component={'div'} textAlign="center">
										<Link
											component={RouterLink}
											to={`${page.route}`}
											style={{
												textDecoration: 'none',
												color: 'inherit',
												textTransform: 'capitalize',
											}}
										>
											{page.name}
										</Link>
									</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>
					<AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
					<Typography
						component={'div'}
						variant="h5"
						noWrap
						sx={{
							mr: 2,
							display: { xs: 'flex', md: 'none' },
							flexGrow: 1,
							fontFamily: 'monospace',
							fontWeight: 700,
							letterSpacing: '.3rem',
							color: 'inherit',
							textDecoration: 'none',
							textTransform: 'capitalize',
						}}
					>
						<Link
							component={RouterLink}
							to={'/'}
							style={{
								textDecoration: 'none',
								color: 'inherit',
							}}
						>
							LOGO
						</Link>
					</Typography>
					<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
						{pages.map((page) => (
							<Button
								key={page.id}
								onClick={handleCloseNavMenu}
								sx={{ my: 2, color: 'white', display: 'block' }}
							>
								<Link
									component={RouterLink}
									to={`${page.route}`}
									style={{
										textDecoration: 'none',
										color: 'inherit',
									}}
								>
									{page.name}
								</Link>
							</Button>
						))}
					</Box>
					{/* User Icon */}
					<Box sx={{ flexGrow: 0 }}>
						<Tooltip title="Open settings">
							<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
								<Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
							</IconButton>
						</Tooltip>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{!user ? (
								<div>
									{loggedOutSettings.map((setting) => (
										<MenuItem key={setting.id} onClick={handleCloseUserMenu}>
											<Typography
												component={'div'}
												textAlign="center"
												style={{ textTransform: 'capitalize' }}
											>
												<Button color="inherit">
													<Link
														component={RouterLink}
														to={`/${setting.route}`}
														style={{
															textDecoration: 'none',
															color: 'inherit',
														}}
													>
														{setting.name}
													</Link>
												</Button>
											</Typography>
										</MenuItem>
									))}
								</div>
							) : (
								<div>
									{loggedInSettings.map((setting) => (
										<MenuItem key={setting.id} onClick={handleCloseUserMenu}>
											<Typography
												component={'div'}
												textAlign="center"
												style={{ textTransform: 'capitalize' }}
											>
												{setting.name !== 'Logout' ? (
													<Button color="inherit">
														<Link
															component={RouterLink}
															to={`/${setting.route}`}
															style={{
																textDecoration: 'none',
																color: 'inherit',
															}}
														>
															{setting.name}
														</Link>
													</Button>
												) : (
													<Button color="error" onClick={onLogout}>
														{setting.name}
													</Button>
												)}
											</Typography>
										</MenuItem>
									))}
								</div>
							)}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default Navbar
