import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
	interface Theme {}
	// allow configuration using `createTheme`
	interface ThemeOptions {}
}

let theme = createTheme({
	palette: {
		primary: {
			main: '#0052cc',
		},
		secondary: {
			main: '#edf2ff',
		},
	},
})

theme = createTheme(theme, {
	palette: {
		info: {
			main: theme.palette.secondary.main,
		},
	},
})

export default theme
