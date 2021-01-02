import { getRepository } from 'typeorm';
import { Category } from './../modules/category/domain/entity/Category';
import { CategoryRepository } from './../modules/category/repositories/CategoryRepository';
import { Body, Get, Post, JsonController } from 'routing-controllers';
import { Repository } from 'typeorm';

@JsonController('/v1/categories')
export class CategoryController {

    @Get('/')
    async getCategories() {

    }

    @Post('/')
    async post(@Body() category: any) {
        const cateRepository = new CategoryRepository()
        const data = new Category()
        data.name = 'akjsdflkj'
        return cateRepository.create(data)
    }
}
