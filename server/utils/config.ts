export const PORT = process.env.PORT as string
export const CLIENT_HOST = process.env.CLIENT_HOST as string
export const MONGO_URI = `mongodb+srv://${process.env.mongodbUsername}:${process.env.mongodbPassword}@messagingapp.fc5kqwd.mongodb.net/?retryWrites=true&w=majority&appName=MessagingApp`

export const config = {
	Memory: true,
	IP: '127.0.0.1',
	Port: '5174',
	Database: 'messagingapp',
}
