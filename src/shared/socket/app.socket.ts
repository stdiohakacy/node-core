import * as socketIO from 'socket.io'

export const appSocket = server => {
    const io = socketIO(server)

    io.use((socket, next) => {
        // verify token
        return next()
    })

    io.on('connection', async(socket: socketIO.Socket) => {
        const socketId = socket.id
        console.log(`Connection socket id = ${socketId} - time ${new Date().toLocaleString()}`)
    })
}
