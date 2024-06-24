// Sending and broadcasting events, .emit and .to
type ServerToClientEventsType = {
	noArgs: () => void
	basicEmit: (a: number, b: string, c: Buffer) => void
	withAck: (d: string, callback: (e: number) => void) => void
}
// Receiving events, .on
type ClientToServerEventsType = {
	hello: () => void
}
// Inter-server communication, .serverSideEmit
type InterServerEventsType = {
	ping: () => void
}
// Socket.data attribute, (socket.data)
type SocketDataType = {
	name: string
	age: string
}
