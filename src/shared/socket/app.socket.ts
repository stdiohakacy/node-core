import { SocketError } from './../exceptions/SocketError';
import { IJwtPayloadExtend } from './../services/auth/RedisAuthService';
import * as socketIO from 'socket.io'
import * as jwt from 'jsonwebtoken';
import { MessageError } from '../exceptions/SystemError';
import { socketRequestFrequency } from '../../modules/chat/helpers/SocketHelper';

export const appSocket = server => {
    const io = socketIO(server)

    io.use((socket, next) => {
        // verify token
        const token = socket.handshake.query.token
        if(!token)
            throw new SocketError(MessageError.PARAM_REQUIRED, 'token')
        try {
            const isValid = jwt.verify(token, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
                issuer: 'node-core',
                audience: `${'http'}://${'localhost'}`,
                algorithms: 'HS256'
            } as unknown as jwt.VerifyOptions) as IJwtPayloadExtend
            if(isValid) next()
        } catch (error) {
            if(error.name === 'TokenExpiredError')
                throw new SocketError(MessageError.PARAM_EXPIRED, 'token')
            else
                throw new SocketError(MessageError.PARAM_INVALID, 'token')
        }
    })

    io.on('connection', async(socket: socketIO.Socket) => {
        socket.use((pack: socketIO.Packet, next) => {
            if(!socketRequestFrequency(socketId)) return next()
            throw new SocketError(MessageError.TOO_MANY_REQUEST)
        })
        const socketId = socket.id
        console.log(`Connection socket id = ${socketId} - time ${new Date().toLocaleString()}`)

        socket.on('sendPriveMsg', async(data, cbFn) => {
            if(!data)
                return
            
        })
    })
}
