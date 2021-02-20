import Container from 'typedi';
import * as http from 'http';
import { createServer } from 'http';
import * as express from 'express';
import 'reflect-metadata';
import { createConnection } from "typeorm";
import { ApiAuthenticator } from './shared/middleware/ApiAuthenticator';
import { AuthController } from './modules/auth/controller/AuthenticateController';
import { LoginController } from './modules/auth/controller/LoginController';
import { ResetPasswordUserController } from './modules/user/controller/ResetPasswordUserController';
import { createExpressServer } from 'routing-controllers';
import { ForgotPasswordUserController } from './modules/user/controller/ForgotPasswordUserController';
import { ResendActivationUserController } from './modules/user/controller/ResendActivationUserController';
import { ActiveUserController } from './modules/user/controller/ActiveUserController';
import { SignUpUserController } from './modules/user/controller/SignUpUserController';
import { FindCategoryController } from './modules/category/controller/FindCategoryController';
import { DeleteCategoryController } from './modules/category/controller/DeleteCategoryController';
import { UpdateCategoryController } from './modules/category/controller/UpdateCategoryController';
import { CreateCategoryController } from './modules/category/controller/CreateCategoryController';
import { GetCategoryByIdController } from './modules/category/controller/GetCategoryByIdController';
import { RedisContext } from './shared/infra/databases/redis/RedisContext';
import { GetProfileUserController } from './modules/user/useCases/queries/get-profile/GetProfileUserController';
import { appSocket } from './shared/socket/app.socket';
import { GetChannelSingleController } from './modules/chat/controller/GetChannelSingleController';
import { CreateProductController } from './modules/product/CreateProductController';


export class ExpressServer {
    static app: express.Application;
    static server: http.Server;

    static init(cb: (app: express.Application) => any) {
        if (!ExpressServer.app) {
            ExpressServer.app = createExpressServer({
                authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
                currentUserChecker: Container.get(ApiAuthenticator).userAuthChecker,
                controllers: [
                    // Category
                    CreateCategoryController, GetCategoryByIdController, UpdateCategoryController, DeleteCategoryController, FindCategoryController,
                    // User
                    SignUpUserController, ActiveUserController, ResendActivationUserController, ForgotPasswordUserController, ResetPasswordUserController, GetProfileUserController,
                    // Auth
                    LoginController, AuthController,
                    // Product
                    CreateProductController,
                    // Channel
                    GetChannelSingleController
                ]
            })

            ExpressServer.app.listen(3000, () => {
                createConnection().then(async connection => {
                    const redisContext = Container.get<RedisContext>('redis.context');
                    redisContext.createConnection();
                    console.log('Express Server listening on port : 3000')
                }).catch(error => console.log("Error: ", error));
            })

            if (cb) {
                cb(ExpressServer.app);
            }
        }
        return ExpressServer;
    }

    static createServer() {
        ExpressServer.server = createServer(ExpressServer.app);
        return ExpressServer;
    }

    static run(port: string) {
        appSocket(ExpressServer.server);

        ExpressServer.server.listen(this.normalizePort(port))
          .on('listening', () => this.onListening(ExpressServer.server))
          .on('error', (error) => this.onError(ExpressServer.server, error));

        // log.debug('ExpressServer was started on environment %s', process.env.NODE_ENV);
        return ExpressServer;
    }

    static async createConnection() {
        return ExpressServer;
    }

    private static normalizePort(port: string): number | string | boolean {
        const parsedPort = parseInt(port, 10);
        if (isNaN(parsedPort)) {
            // named pipe
            return port;
        }
        if (parsedPort >= 0) {
            // port number
            return parsedPort;
        }
        return false;
    }

    private static onListening(server: http.Server): void {
        console.log('Socket server on listening at port : 5000')
    }

    private static onError(server: http.Server, error: Error): void {
        if (error['syscall'] !== 'listen') {
            throw error;
        }
        const addr = server.address();
        // handle specific listen errors with friendly messages
        switch (error['code']) {
            case 'EACCES':
                process.exit(1);
                break;
            case 'EADDRINUSE':
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private static bind(addr: string | any): string {
        return typeof addr === 'string' ? `pipe ${addr}` : `port http://localhost:${addr.port}`;
    }
}
