import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { createConnection } from "typeorm";
import { CreateCategoryController } from './modules/category/controller/CreateCategoryController';
import { GetCategoryByIdController } from './modules/category/controller/GetCategoryByIdController';

const app = createExpressServer({
    controllers: [
        CreateCategoryController, GetCategoryByIdController
    ]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
        console.log('OK')
    }).catch(error => console.log("Error: ", error));
})
