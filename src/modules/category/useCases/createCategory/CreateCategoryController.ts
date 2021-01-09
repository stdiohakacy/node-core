import { ICreateCategoryDTO } from './ICreateCategoryDTO';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';
import { Body, Post, JsonController } from 'routing-controllers';
import { CreateCategoryResponse } from './CreateCategoryResponse';

@JsonController('/v1/categories')
export class CreateCategoryController {
    private _useCase: CreateCategoryUseCase
    constructor() {
        this._useCase = new CreateCategoryUseCase()
    }

    @Post('/')
    async post(@Body() param: ICreateCategoryDTO): Promise<CreateCategoryResponse> {
        return await this._useCase.execute(param)
    }
}
