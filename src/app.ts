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
import { getSingleChannel, updateUserSocketId } from "./modules/chat/useCases/SocketUseCase";
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

                // send private message
                socket.on('connect-single-channel', async (data: any, cbFn) => {
                    const channel = await getSingleChannel(data.toUserId, userId)
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@')
                    console.log(channel)
                    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@')
                })
            })
        })
        .catch(error => console.log("Error: ", error));
})

const server = httpServer.listen(5000, () => {
    console.log(`Http Server listening on port ${5000}`)

})
