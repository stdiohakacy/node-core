import { ResendActivationUserController } from './modules/user/controller/ResendActivationUserController';
import { ActiveUserController } from './modules/user/controller/ActiveUserController';
import { SignUpUserController } from './modules/user/controller/SignUpUserController';
import { FindCategoryController } from './modules/category/controller/FindCategoryController';
import { DeleteCategoryController } from './modules/category/controller/DeleteCategoryController';
import { UpdateCategoryController } from './modules/category/controller/UpdateCategoryController';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { createConnection } from "typeorm";
import { CreateCategoryController } from './modules/category/controller/CreateCategoryController';
import { GetCategoryByIdController } from './modules/category/controller/GetCategoryByIdController';

const app = createExpressServer({
    controllers: [
        // Category
        CreateCategoryController, GetCategoryByIdController, UpdateCategoryController, DeleteCategoryController, FindCategoryController,
        // User
        SignUpUserController, ActiveUserController, ResendActivationUserController
    ]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
        console.log('OK')
    }).catch(error => console.log("Error: ", error));
})
