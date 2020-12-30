import { Category } from './../entity/Category';
import { Controller, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { getRepository } from 'typeorm';

@Controller()
export class CategoryController {
    private categoryRepository = getRepository(Category)

    @Get('/categories')
    async getCategories() {
        return await this.categoryRepository.findAndCount()
    }

    @Post('/categories')
    async post(@Body() category: any) {
        return await this.categoryRepository.insert({name: 'Category 01'})
    }
}
