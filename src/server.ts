import * as http from 'http';
import * as express from 'express';
import { createServer } from 'http';
import { ApiAuthenticator } from './shared/middleware/ApiAuthenticator';
import { AuthController } from './modules/auth/controller/AuthenticateController';
import { LoginController } from './modules/auth/controller/LoginController';
import { ResetPasswordUserController } from './modules/user/controller/ResetPasswordUserController';
import 'reflect-metadata';
import { createConnection } from "typeorm";
import { createExpressServer } from 'routing-controllers';
import { ForgotPasswordUserController } from './modules/user/controller/ForgotPasswordUserController';
import { ResendActivationUserController } from './modules/user/controller/ResendActivationUserController';
import { ActiveUserController } from './modules/user/controller/ActiveUserController';
import { SignUpUserController } from './modules/user/controller/SignUpUserController';

import { 
    CreateCategoryController, 
    GetCategoryByIdController,
    UpdateCategoryController,
    DeleteCategoryController,
    FindCategoryController 
} from './modules/category/controller';

import { RedisContext } from './shared/infra/databases/redis/RedisContext';
import Container from 'typedi';
import { GetProfileUserController } from './modules/user/useCases/queries/get-profile/GetProfileUserController';
import { appSocket } from './shared/socket/app.socket';
import { GetChannelSingleController } from './modules/chat/controller/GetChannelSingleController';
import { CreateProductController } from './modules/product/CreateProductController';
import { GetChannelByIdController } from './modules/chat/controller/GetChannelByIdController';
import { UpdateChannelController } from './modules/chat/UpdateChannelController';


export class ExpressServer {
    static app: express.Application;
    static server: http.Server;

    static init(cb: (app: express.Application) => any) {
        if (!this.app) {
            this.app = createExpressServer({
                authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
                currentUserChecker: Container.get(ApiAuthenticator).userAuthChecker,
                controllers: [
                    // Chat
                    GetChannelSingleController, GetChannelByIdController, UpdateChannelController,
                    // Category
                    CreateCategoryController, GetCategoryByIdController, UpdateCategoryController, DeleteCategoryController, FindCategoryController,
                    // User
                    SignUpUserController, ActiveUserController, ResendActivationUserController, ForgotPasswordUserController, ResetPasswordUserController, GetProfileUserController,
                    // Auth
                    LoginController, AuthController,
                    // Product
                    CreateProductController
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
        return ExpressServer;
    }

    static createServer() {
        this.server = createServer(this.app);
        return ExpressServer;
    }

    static run(port: string) {
        appSocket(this.server);

        this.server.listen(this.normalizePort(port))
          .on('listening', () => this.onListening(this.server))
          .on('error', (error) => this.onError(this.server, error));

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
