import { Body, Get, Post, JsonController } from 'routing-controllers';
import { Category } from '../../domain/entity/Category';
import { CategoryRepository } from '../../repositories/CategoryRepository';

@JsonController('/v1/categories')
export class CreateCategoryController {
    private _categoryRepository: CategoryRepository
    constructor() {
        this._categoryRepository = new CategoryRepository()
    }

    @Get('/')
    async getCategories() {

    }

    @Post('/')
    async post(@Body() category: any) {
        const data = new Category()
        data.name = 'akjsdflkj'
        return this._categoryRepository.create(data)
    }
}
