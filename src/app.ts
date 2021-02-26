import { createExpressServer } from "routing-controllers";
import Container from "typedi";
import { ApiAuthenticator } from "./shared/middleware/ApiAuthenticator";
import * as path from 'path'
import { createConnection } from "typeorm";
import { RedisContext } from "./shared/infra/databases/redis/RedisContext";
import * as http from 'http'
import * as socketIO from 'socket.io'
// ExpressServer.init((app: express.Application) => { })
//     .createServer()
//     .createConnection()
//     .then(
//         () => {
//             ExpressServer.run('5000')
//         }
//     )
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


const app = createExpressServer({
    authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
    currentUserChecker: Container.get(ApiAuthenticator).userAuthChecker,
    controllers: [
        path.join(__dirname, '/modules/**/controller/*{.js,.ts}')
    ]
})

app.listen(3000, () => {
    createConnection().then(async connection => {
        const redisContext = Container.get<RedisContext>('redis.context');
        redisContext.createConnection();
        console.log('Express Server listening on port : 3000')
    }).catch(error => console.log("Error: ", error));
})

let httpServer = new http.Server(app)
let io = socketIO(httpServer)
io.on('connection', async socket => {
    const socketId = socket.id
    let userId
    let clientHomePageList

    await emitAsync(socket, 'initSocket', socketId, (uid, homePageList) => {
        userId = uid
        clientHomePageList = homePageList
    });
})

const server = httpServer.listen(5000, () => {
    console.log(`Listening on ${5000}`)
})

// let http = require('http').Server(app)
// let io = require('socket.io')(http)

// io.on('connection', socket => {
// })

// const server = http.listen(5000, () => {
//     console.log(`Listening on ${5000}`)
// })
