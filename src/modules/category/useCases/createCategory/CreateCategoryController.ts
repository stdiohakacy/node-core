import { ICreateCategoryDTO } from './ICreateCategoryDTO';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';
import { Body, Get, Post, JsonController } from 'routing-controllers';

@JsonController('/v1/categories')
export class CreateCategoryController {
    private _useCase: CreateCategoryUseCase
    constructor() {
        this._useCase = new CreateCategoryUseCase()
    }

    @Get('/')
    async getCategories() {

    }

    @Post('/')
    async post(@Body() param: ICreateCategoryDTO): Promise<string> {
        return await this._useCase.execute(param)
    }
}
