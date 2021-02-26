import { PrivateMessageDb } from './modules/chat/infra/databases/typeorm/entities/PrivateMessageDb';
import { SocketError } from './shared/exceptions/SocketError';
import { createExpressServer } from "routing-controllers";
import Container from "typedi";
import { ApiAuthenticator } from "./shared/middleware/ApiAuthenticator";
import * as path from 'path'
import { createConnection } from "typeorm";
import { RedisContext } from "./shared/infra/databases/redis/RedisContext";
import * as http from 'http'
import * as socketIO from 'socket.io'
import { checkSpamSocket, emitSocketToUser, savePrivateMessage, socketRequestFrequency, updateUserSocketId, verifySocketIO } from "./modules/chat/helpers/SocketHelper";
import { UserDb } from "./modules/user/infra/databases/typeorm/entities/UserDb";
import { ServiceRepositoriesContext } from "./shared/repository/ServiceRepositoryContext";
import { UserRepository } from "./modules/user/repositories/UserRepository";
import { RedisAuthService } from "./shared/services/auth/RedisAuthService";
import { UnauthorizedError } from "./shared/exceptions/UnauthorizedError";
import { MessageError } from "./shared/exceptions/SystemError";
import { PrivateMessageRepository } from './modules/chat/private/repositories/PrivateMessageRepository';
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

            ServiceRepositoriesContext
                .getInstance()
                .setUserRepository(new UserRepository())
                .setRedisAuthService(new RedisAuthService())
                .setPrivateMessageRepository(new PrivateMessageRepository())
        })
        .then(() => {
            io.use((socket, next) => {
                let token = socket.handshake.query.token
                verifySocketIO(token, next)
            })

            io.on('connection', async socket => {
                socket.use((pack, next) => {
                    checkSpamSocket(socket.id, next)
                })

                const socketId = socket.id
                let userId
                let clientHomePageList

                await emitAsync(socket, 'init-socket', socketId, (uid, homePageList) => {
                    userId = uid
                    clientHomePageList = homePageList
                });

                // update socket id for user
                await updateUserSocketId(userId, socketId)

                // send private message
                socket.on('send-private-message', async (data: any, cbFn) => {
                    if(!data)
                        throw new Error(`Message data is require`)
                    await Promise.all([
                        await savePrivateMessage(userId, data),
                        await emitSocketToUser(io, data)
                    ])
                })
            })
        })
        .catch(error => console.log("Error: ", error));
})

function emitAsync(socket, emitName, data, callback) {
    return new Promise((resolve, reject) => {
        if (!socket || !socket.emit) {
            reject('pls input socket');
        }
        socket.emit(emitName, data, (...args) => {
            let response;
            if (typeof callback === 'function') {
                response = callback(...args);
            }
            resolve(response);
        });
    });
}

const server = httpServer.listen(5000, () => {
    console.log(`Http Server listening on port ${5000}`)

})
