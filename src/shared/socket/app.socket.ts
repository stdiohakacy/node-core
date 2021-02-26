// import { ServiceRepositoryContext } from './../repository/ServiceRepositoryContext';
// import { SocketError } from './../exceptions/SocketError';
// import { IJwtPayloadExtend } from './../services/auth/RedisAuthService';
// import * as socketIO from 'socket.io'
// import * as jwt from 'jsonwebtoken';
// import { MessageError } from '../exceptions/SystemError';
// import { socketRequestFrequency } from '../../modules/chat/helpers/SocketHelper';
// import { UserDb } from '../../modules/user/infra/databases/typeorm/entities/UserDb';


// function emitAsync(socket, emitName, data, callback) {
//     return new Promise((resolve, reject) => {
//       if (!socket || !socket.emit) {
//         // eslint-disable-next-line prefer-promise-reject-errors
//         reject('pls input socket');
//       }
//       socket.emit(emitName, data, (...args) => {
//         let response;
//         if (typeof callback === 'function') {
//           response = callback(...args);
//         }
//         resolve(response);
//       });
//     });
//   }
  

// export const appSocket = server => {
//     const { userRepository } = ServiceRepositoryContext.getInstance()
//     const io = socketIO(server)

//     io.use((socket, next) => {
//         // verify token
//         const token = socket.handshake.query.token
//         if(!token)
//             throw new SocketError(MessageError.PARAM_REQUIRED, 'token')
//         try {
//             const isValid = jwt.verify(token, 'mwGAPb8uwN9MMGdg9CbzPhssARDL9E7fggHdLbwRb5A4p4w9NHAAJjN4sZXyWWMrCnCfj4quCyG2qKmY2C9Qnk5j5MRDV8rTJXfKvaM9S2wLkGjERWvtmmakzHeGZV6r', {
//                 issuer: 'node-core',
//                 audience: `${'http'}://${'localhost'}`,
//                 algorithms: 'HS256'
//             } as unknown as jwt.VerifyOptions) as IJwtPayloadExtend
//             if(isValid) next()
//         } catch (error) {
//             if(error.name === 'TokenExpiredError')
//                 throw new SocketError(MessageError.PARAM_EXPIRED, 'token')
//             else
//                 throw new SocketError(MessageError.PARAM_INVALID, 'token')
//         }
//     })

//     io.on('connection', async(socket: socketIO.Socket) => {
        // console.log('Server Connected Socket IO')
        // let userId
        // let clientHomePageList
        // const socketId = socket.id
        // console.log(`Connection socket id = ${socketId} - time ${new Date().toLocaleString()}`)

        // await emitAsync(socket, 'initSocket', socketId, (uid, homePageList) => {
        //     userId = uid
        //     clientHomePageList = homePageList
        // })


        // socket.use((pack: socketIO.Packet, next) => {
        //     if(!socketRequestFrequency(socketId))
        //         return next()
        //     throw new SocketError(MessageError.TOO_MANY_REQUEST)
        // })
        
        // init socket
        // const user = await userRepository.getById(userId)
        // console.log(user)
        // if(!user)
        //     throw new Error('User not found')
        // const socketIds = user.socketIds
        // const newSocketIds = socketIdHandler(socketIds) ? `${socketIdHandler(socketIds)},${socketId}` : socketId
        
        // const userDb = new UserDb()
        // userDb.socketIds = newSocketIds

        // const isUpdatedSocketId = await userRepository.update(userId, userDb)
        // if(!isUpdatedSocketId)
        //     throw new Error('Update socket id of user cant not saved')
        // console.log('initSocket user_id=>', userId, 'time=>', new Date().toLocaleString());
//     })
// }
