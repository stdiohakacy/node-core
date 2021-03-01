import { UpdateChannelCommandDTO } from './modules/chat/dtos/UpdateChannelCommandDTO';
import { createExpressServer } from "routing-controllers";
import Container from "typedi";
import { ApiAuthenticator } from "./shared/middleware/ApiAuthenticator";
import * as path from 'path'
import { createConnection } from "typeorm";
import { RedisContext } from "./shared/infra/databases/redis/RedisContext";
import * as http from 'http'
import * as socketIO from 'socket.io'
import { SocketServiceRepoContext } from "./modules/chat/useCases/SocketServiceRepoContext";
import { UserRepository } from "./modules/user/repositories/UserRepository";
import { ChannelRepository } from "./modules/chat/repositories/ChannelRepository";
import { ChannelUserRepository } from "./modules/chat/repositories/ChannelUserRepository";
import { MessageRepository } from "./modules/chat/repositories/MessageRepository";
import { RedisAuthService } from "./shared/services/auth/RedisAuthService";
import { checkSpamSocket, emitAsync, verifySocketIO } from "./modules/chat/helpers/SocketHelper";
import { createMessage, deleteChannel, getChannelsByUser, getSingleChannel, readChannel, updateChannel, updateUserSocketId } from "./modules/chat/useCases/SocketUseCase";
import { CreateMessageCommandDTO } from "./modules/chat/dtos/CreateMessageCommandDTO";
// ExpressServer.init((app: express.Application) => { })
//     .createServer()
//     .createConnection()
//     .then(
//         () => {
//             ExpressServer.run('5000')
//         }
//     )

const app = createExpressServer({
    authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
    currentUserChecker: Container.get(ApiAuthenticator).userAuthChecker,
    controllers: [
        path.join(__dirname, '/modules/**/controller/*{.js,.ts}')
    ]
})

let httpServer = new http.Server(app)
let io = socketIO(httpServer)

app.listen(3000, () => {
    createConnection()
        .then(async connection => {
            const redisContext = Container.get<RedisContext>('redis.context');
            redisContext.createConnection();
            console.log('App Express Server listening on port : 3000')

            SocketServiceRepoContext
                .getInstance()
                .setRedisAuthService(new RedisAuthService())
                .setUserRepository(new UserRepository())
                .setChannelRepository(new ChannelRepository())
                .setChannelUserRepository(new ChannelUserRepository())
                .setMessageRepository(new MessageRepository())
        })
        .then(() => {
            let userId
            io.use((socket, next) => {
                let token = socket.handshake.query.token
                verifySocketIO(token, next)
            })

            io.on('connection', async socket => {
                socket.use((pack, next) => {
                    checkSpamSocket(socket.id, next)
                })

                const socketId = socket.id
                // let userId
                let clientHomePageList

                await emitAsync(socket, 'init-socket', socketId, (uid, homePageList) => {
                    userId = uid
                    clientHomePageList = homePageList
                });

                // update socket id for user
                await updateUserSocketId(userId, socketId)

                // get single channel
                socket.on('get-single-channel', async (data: any, cbFn) => {
                    const { toUserId } = data
                    try {
                        const channel = await getSingleChannel(toUserId, userId, socket)
                        socket.emit('get-single-channel', channel)
                        console.log(`Channel id is ${channel.id} - time ${new Date().toLocaleString()}`)
                        cbFn(channel)
                    } catch (error) {
                        console.log('error', error.message);
                        io.to(socketId).emit('error', { code: 500, message: error.message });
                    }
                })

                socket.on('send-message', async (input: any, cbFn) => {
                    try {
                        const { channelId, content, isPin, isStar } = input

                        const messageDTO = new CreateMessageCommandDTO()
                        messageDTO.channelId = channelId
                        messageDTO.content = content
                        messageDTO.isPin = isPin,
                            messageDTO.isStar = isStar

                        const message = await createMessage(messageDTO, userId, socket)
                        cbFn(message)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', { code: 500, message: error.message });
                    }
                })

                socket.on('get-channels', async (input: any, cbFn) => {
                    try {
                        const [channels, count] = await getChannelsByUser(userId, input, socket)
                        cbFn([channels, count])
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', { code: 500, message: error.message });
                    }
                })

                socket.on('read-channel', async (input, cbFn) => {
                    try {
                        const { channelId } = input
                        const channel = await readChannel(channelId, userId, socket)
                        cbFn(channel)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', { code: 500, message: error.message });
                    }
                })

                socket.on('update-channel', async (input: any, cbFn) => {
                    try {
                        const dto = new UpdateChannelCommandDTO()
                        dto.name = input.name
                        dto.description = input.description
                        dto.isPrivate = input.isPrivate

                        const isUpdated = await updateChannel(input.channelId, dto, socket)
                        cbFn(isUpdated)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', { code: 500, message: error.message });
                    }
                })

                socket.on('delete-channel', async(input: any, cbFn) => {
                    const { channelId } = input
                    try {
                        const isDeleted = await deleteChannel(channelId, socket)
                        cbFn(isDeleted)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', { code: 500, message: error.message });
                    }
                })

            })
        })
        .catch(error => console.log("Error: ", error));
})

const server = httpServer.listen(5000, () => {
    console.log(`Http Server listening on port ${5000}`)

})
