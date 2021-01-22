import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { createConnection } from "typeorm";
import { CategoryController } from './modules/category/controller/CategoryController';
import { RootController } from './modules/category/controller/RootController';

const app = createExpressServer({
    controllers: [
        CategoryController, RootController
    ]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
        console.log('OK')
    }).catch(error => console.log("Error: ", error));
})
