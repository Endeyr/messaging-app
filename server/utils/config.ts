export const PORT = 5174
export const CLIENT_HOST = 'http://127.0.0.1:5173'
export const MONGO_URI = `mongodb+srv://${process.env.mongodbUsername}:${process.env.mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`

export const config = {
	Memory: true,
	IP: '127.0.0.1',
	Port: '5174',
	Database: 'messagingapp',
}
