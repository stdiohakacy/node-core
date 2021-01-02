// import { Category } from './../modules/category/domain/entity/Category';
// import { CategoryRepository } from './../modules/category/repositories/CategoryRepository';
// import { Body, Get, Post, JsonController } from 'routing-controllers';

// @JsonController('/v1/categories')
// export class CategoryController {
//     private _categoryRepository: CategoryRepository
//     constructor() {
//         this._categoryRepository = new CategoryRepository()
//     }

//     @Get('/')
//     async getCategories() {

//     }

//     @Post('/')
//     async post(@Body() category: any) {
//         const data = new Category()
//         data.name = 'akjsdflkj'
//         return this._categoryRepository.create(data)
//     }
// }
