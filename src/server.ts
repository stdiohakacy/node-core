// import * as http from 'http';
// import * as express from 'express';
// import { createServer } from 'http';
// import { ApiAuthenticator } from './shared/middleware/ApiAuthenticator';
// import 'reflect-metadata';
// import { createConnection } from "typeorm";
// import { createExpressServer } from 'routing-controllers';
// import { RedisContext } from './shared/infra/databases/redis/RedisContext';
// import Container from 'typedi';
// import { appSocket } from './shared/socket/app.socket';
// import * as path from 'path'

// export class ExpressServer {
//     static app: express.Application;
//     static server: http.Server;

//     static init(cb: (app: express.Application) => any) {
//         if (!this.app) {
//             this.app = createExpressServer({
//                 authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
//                 currentUserChecker: Container.get(ApiAuthenticator).userAuthChecker,
//                 controllers: [
//                     path.join(__dirname, '/modules/**/controller/*{.js,.ts}')
//                 ]
//             })

//             this.app.listen(3000, () => {
//                 createConnection().then(async connection => {
//                     const redisContext = Container.get<RedisContext>('redis.context');
//                     redisContext.createConnection();
//                     console.log('Express Server listening on port : 3000')
//                 }).catch(error => console.log("Error: ", error));
//             })

//             if (cb) {
//                 cb(this.app);
//             }
//         }
//         return ExpressServer;
//     }

//     static createServer() {
//         this.server = createServer(this.app);
//         return ExpressServer;
//     }

//     static run(port: string) {
//         appSocket(this.server);

//         this.server.listen(this.normalizePort(port))
//           .on('listening', () => this.onListening(this.server))
//           .on('error', (error) => this.onError(this.server, error));

//         // log.debug('ExpressServer was started on environment %s', process.env.NODE_ENV);
//         return ExpressServer;
//     }

//     static async createConnection() {
//         return ExpressServer;
//     }

//     private static normalizePort(port: string): number | string | boolean {
//         const parsedPort = parseInt(port, 10);
//         if (isNaN(parsedPort)) {
//             // named pipe
//             return port;
//         }
//         if (parsedPort >= 0) {
//             // port number
//             return parsedPort;
//         }
//         return false;
//     }

//     private static onListening(server: http.Server): void {
//         console.log('Socket server on listening at port : 5000')
//     }

//     private static onError(server: http.Server, error: Error): void {
//         if (error['syscall'] !== 'listen') {
//             throw error;
//         }
//         const addr = server.address();
//         // handle specific listen errors with friendly messages
//         switch (error['code']) {
//             case 'EACCES':
//                 process.exit(1);
//                 break;
//             case 'EADDRINUSE':
//                 process.exit(1);
//                 break;
//             default:
//                 throw error;
//         }
//     }

//     private static bind(addr: string | any): string {
//         return typeof addr === 'string' ? `pipe ${addr}` : `port http://localhost:${addr.port}`;
//     }
// }


if (!this.app) {
    this.app = createExpressServer({
        authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
        currentUserChecker: Container.get(ApiAuthenticator).userAuthChecker,
        controllers: [
            path.join(__dirname, '/modules/**/controller/*{.js,.ts}')
        ]
    })

    this.app.listen(3000, () => {
        createConnection().then(async connection => {
            const redisContext = Container.get<RedisContext>('redis.context');
            redisContext.createConnection();
            console.log('Express Server listening on port : 3000')
        }).catch(error => console.log("Error: ", error));
    })

    if (cb) {
        cb(this.app);
    }
}
