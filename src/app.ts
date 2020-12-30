// this shim is required
import { createExpressServer } from 'routing-controllers';
import {createConnection} from "typeorm";
import { CategoryController } from './controller/CategoryController';
// import { CategoryController } from './controller/CategoryController';


const app = createExpressServer({
    controllers: [CategoryController]
});

app.listen(3000, () => {
    createConnection().then(async connection => {
    }).catch(error => console.log("Error: ", error));
})
