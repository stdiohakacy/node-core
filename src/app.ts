import { CategoryController } from './modules/category/controller/CategoryController';
import { createExpressServer } from 'routing-controllers';
import { createConnection } from "typeorm";

const app = createExpressServer({
    controllers: [
        CategoryController,
    ]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
        console.log('OK')
    }).catch(error => console.log("Error: ", error));
})
