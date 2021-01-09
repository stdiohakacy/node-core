import { GetCategoryByIdController } from './modules/category/useCases/getCategoryById/GetCategoryByIdController';
// this shim is required
import { createExpressServer } from 'routing-controllers';
import { createConnection } from "typeorm";
import { CreateCategoryController } from './modules/category/useCases/createCategory/CreateCategoryController';
import { DeleteCategoryController } from './modules/category/useCases/deleteCategory/DeleteCategoryController';
// import { CategoryController } from './controller/CategoryController';


const app = createExpressServer({
    controllers: [
        CreateCategoryController, 
        DeleteCategoryController, 
        GetCategoryByIdController
    ]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
        console.log('OK')
    }).catch(error => console.log("Error: ", error));
})
