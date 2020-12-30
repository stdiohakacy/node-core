import { Category } from '../shared/infra/databases/typeorm/entity/Category';
import { Controller, Param, Body, Get, Post, Put, Delete, JsonController } from 'routing-controllers';
import { getRepository } from 'typeorm';

@JsonController('/v1/categories')
export class CategoryController {
    private categoryRepository = getRepository(Category)

    @Get('/')
    async getCategories() {
        return await this.categoryRepository.findAndCount()
    }

    @Post('/categories')
    async post(@Body() category: any) {
        return await this.categoryRepository.insert({name: 'Category 01'})
    }
}
