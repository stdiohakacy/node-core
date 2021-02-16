import { ApiAuthenticator } from './shared/middleware/ApiAuthenticator';
import { AuthController } from './modules/auth/controller/AuthenticateController';
import { LoginController } from './modules/auth/controller/LoginController';
import { ResetPasswordUserController } from './modules/user/controller/ResetPasswordUserController';
import 'reflect-metadata';
import { createConnection } from "typeorm";
import { Action, createExpressServer } from 'routing-controllers';
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
import Container from 'typedi';

const app = createExpressServer({
    authorizationChecker: Container.get(ApiAuthenticator).authorizationHttpChecker,
    controllers: [
        // Category
        CreateCategoryController, GetCategoryByIdController, UpdateCategoryController, DeleteCategoryController, FindCategoryController,
        // User
        SignUpUserController, ActiveUserController, ResendActivationUserController, ForgotPasswordUserController, ResetPasswordUserController,
        // Auth
        LoginController, AuthController
    ]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
        const redisContext = Container.get<RedisContext>('redis.context');
        redisContext.createConnection();
        console.log('OK')
    }).catch(error => console.log("Error: ", error));
})
