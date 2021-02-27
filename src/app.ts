import { createExpressServer } from "routing-controllers";
import Container from "typedi";
import { ApiAuthenticator } from "./shared/middleware/ApiAuthenticator";
import * as path from 'path'
import { createConnection } from "typeorm";
import { RedisContext } from "./shared/infra/databases/redis/RedisContext";
import * as http from 'http'
import * as socketIO from 'socket.io'
import { checkSpamSocket, emitSocketToUser, joinGroup, leaveGroup, saveAndJoinGroup, savePrivateMessage, sendGroupMessage, socketRequestFrequency, updateUserSocketId, verifySocketIO } from "./modules/chat/helpers/SocketHelper";
import { ServiceRepositoriesContext } from "./shared/repository/ServiceRepositoryContext";
import { UserRepository } from "./modules/user/repositories/UserRepository";
import { RedisAuthService } from "./shared/services/auth/RedisAuthService";
import { PrivateMessageRepository } from './modules/chat/private/repositories/PrivateMessageRepository';
import { GroupRepository } from './modules/chat/group/repositories/GroupRepository';
import { GroupUserRepository } from './modules/chat/group/repositories/GroupUserRepository';
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
                .setGroupRepository(new GroupRepository())
                .setGroupUserRepository(new GroupUserRepository())
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
                socket.on('send-private-message', async (data: any, cbFn) => {
                    if (!data)
                        throw new Error(`Message data is require`)
                    try {
                        await Promise.all([
                            await savePrivateMessage(userId, data),
                            await emitSocketToUser(io, data)
                        ])
                        console.log(`Private message sent - data ${data} - time - ${new Date().toLocaleString()}`);
                        cbFn(data)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', {
                            code: 500,
                            message: error.message
                        })
                    }
                })
                // create group
                socket.on('create-group', async(data, cbFn) => {
                    if(!data)
                        throw new Error(`Group data is require`)
                    try {
                        const toGroupId = await saveAndJoinGroup(userId, data, socket)
                        console.log(`Create group ${data} - time ${new Date().toLocaleString()}`)
                        cbFn({toGroupId, ...data})
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', {
                            code : 500,
                            message: error.message
                        })
                    }
                })
                // send group message
                socket.on('send-group-message', async (data, cbFn) => {
                    if(!data)
                        throw new Error(`Message data is require`)
                    try {
                        await sendGroupMessage(userId, data, socket)
                        console.log(`Group message sent - data ${data} - time ${new Date().toLocaleString()}`)
                        cbFn(data)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', {
                            code: 500,
                            message: error.message
                        })
                    }
                })
                // join group
                socket.on('join-group', async(data, cbFn) => {
                    try {
                        await joinGroup(data, socket)
                        console.log(`Joined group - data : ${ JSON.parse(JSON.stringify(data))} - time ${new Date().toLocaleString()}`)
                        cbFn(data)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', {
                            code: 500,
                            message: error.message
                        })
                    }
                })

                // leave group
                socket.on('leave-group', async(data) => {
                    try {
                        await leaveGroup(data, socket)
                        console.log(`Leave group - data ${data} - time : ${new Date().toLocaleString()}`)
                    } catch (error) {
                        console.error(error)
                        io.to(socketId).emit('error', {
                            code: 500,
                            message: error.message
                        })
                    }
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
