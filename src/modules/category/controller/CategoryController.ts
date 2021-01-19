import { Body, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from "routing-controllers";
import Container from 'typedi';
import { FindCategoriesUseCase } from './../useCases/queries/find/FindCategoriesUseCase';
import { FindCategoriesResponse } from './../useCases/queries/find/FindCategoriesResponse';
import { FindCategoriesQueryDTO } from './../useCases/queries/find/FindCategoriesQueryDTO';
import { DeleteCategoryUseCase } from '../useCases/commands/delete/DeleteCategoryUseCase';
import { DeleteCategoryCommandDTO } from '../useCases/commands/delete/DeleteCategoryCommandDTO';
import { UpdateCategoryResponse } from '../useCases/commands/update/UpdateCategoryResponse';
import { GetCategoryByIdResponse } from '../useCases/queries/getById/GetCategoryByIdResponse';
import { GetCategoryByIdUseCase } from '../useCases/queries/getById/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../useCases/commands/update/UpdateCategoryUseCase';
import { CreateCategoryUseCase } from "../useCases/commands/create/CreateCategoryUseCase";
import { GetCategoryByIdQueryDTO } from '../useCases/queries/getById/GetCategoryByIdQueryDTO';
import { CreateCategoryCommandDTO } from '../useCases/commands/create/CreateCategoryCommandDTO';
import { CreateCategoryResponse } from '../useCases/commands/create/CreateCategoryResponse';
import { UpdateCategoryCommandDTO } from '../useCases/commands/update/UpdateCategoryCommandDTO';
import { DeleteCategoryResponse } from '../useCases/commands/delete/DeleteCategoryResponse';

@JsonController('/v1/categories')
export class CategoryController {
    constructor(
        private readonly _findCategoriesUseCase: FindCategoriesUseCase = Container.get(FindCategoriesUseCase),
        private readonly _getCategoryByIdUseCase: GetCategoryByIdUseCase = Container.get(GetCategoryByIdUseCase),
        private readonly _createCategoryUseCase: CreateCategoryUseCase = Container.get(CreateCategoryUseCase),
        private readonly _updateCategoryUseCase: UpdateCategoryUseCase = Container.get(UpdateCategoryUseCase),
        private readonly _deleteCategoryUseCase: DeleteCategoryUseCase = Container.get(DeleteCategoryUseCase),
    ) {}

    @Get('/')
    async find(@QueryParams() param: FindCategoriesQueryDTO): Promise<FindCategoriesResponse> {
        return await this._findCategoriesUseCase.execute(param)
    }

    @Get('/:id([0-9a-f-]{36})')
    async getById(@Params() param: GetCategoryByIdQueryDTO): Promise<GetCategoryByIdResponse> {
        return await this._getCategoryByIdUseCase.execute(param);
    }

    @Post('/')
    async post(@Body() param: CreateCategoryCommandDTO): Promise<CreateCategoryResponse> {
        return await this._createCategoryUseCase.execute(param)
    }

    @Put('/:id([0-9a-f-]{36})')
    async update(@Param('id') id: string, @Body() param: UpdateCategoryCommandDTO): Promise<UpdateCategoryResponse> {
        param.id = id;
        return await this._updateCategoryUseCase.execute(param);
    }
    
    @Delete('/:id([0-9a-f-]{36})')
    async delete(@Params() param: DeleteCategoryCommandDTO): Promise<DeleteCategoryResponse> {
        return await this._deleteCategoryUseCase.execute(param);
    }
}
