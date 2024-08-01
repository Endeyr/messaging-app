export const PORT = 5174
export let CLIENT_HOST: string
if (process.env.NODE_ENV === 'development') {
	CLIENT_HOST = 'http://localhost:5173'
} else {
	CLIENT_HOST = 'https://messaging-app-frontend-one.vercel.app'
}
export const MONGO_URI = `mongodb+srv://${process.env.mongodbUsername}:${process.env.mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`

export const config = {
	Memory: true,
	IP: '127.0.0.1',
	Port: '5174',
	Database: 'messagingapp',
}
