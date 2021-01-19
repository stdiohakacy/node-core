import { Body, Delete, Get, JsonController, Param, Params, Post, Put, QueryParams } from "routing-controllers";
import Container from 'typedi';
import { FindCategoriesUseCase } from './../useCases/queries/find/FindCategoriesUseCase';
import { FindCategoriesResponse } from './../useCases/queries/find/FindCategoriesResponse';
import { FindCategoriesDTO } from './../useCases/queries/find/FindCategoriesDTO';
import { DeleteCategoryUseCase } from '../useCases/commands/delete/DeleteCategoryUseCase';
import { IDeleteCategoryDTO } from '../useCases/commands/delete/IDeleteCategoryDTO';
import { UpdateCategoryResponse } from '../useCases/commands/update/UpdateCategoryResponse';
import { GetCategoryByIdResponse } from '../useCases/queries/getById/GetCategoryByIdResponse';
import { GetCategoryByIdUseCase } from '../useCases/queries/getById/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../useCases/commands/update/UpdateCategoryUseCase';
import { CreateCategoryUseCase } from "../useCases/commands/create/CreateCategoryUseCase";
import { IGetCategoryByIdDTO } from '../useCases/queries/getById/IGetCategoryById';
import { ICreateCategoryDTO } from '../useCases/commands/create/ICreateCategoryDTO';
import { CreateCategoryResponse } from '../useCases/commands/create/CreateCategoryResponse';
import { IUpdateCategoryDTO } from '../useCases/commands/update/IUpdateCategoryDTO';
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
    async find(@QueryParams() param: FindCategoriesDTO): Promise<FindCategoriesResponse> {
        return await this._findCategoriesUseCase.execute(param)
    }

    @Get('/:id([0-9a-f-]{36})')
    async getById(@Params() param: IGetCategoryByIdDTO): Promise<GetCategoryByIdResponse> {
        return await this._getCategoryByIdUseCase.execute(param);
    }

    @Post('/')
    async post(@Body() param: ICreateCategoryDTO): Promise<CreateCategoryResponse> {
        return await this._createCategoryUseCase.execute(param)
    }

    @Put('/:id([0-9a-f-]{36})')
    async update(@Param('id') id: string, @Body() param: IUpdateCategoryDTO): Promise<UpdateCategoryResponse> {
        param.id = id;
        return await this._updateCategoryUseCase.execute(param);
    }
    
    @Delete('/:id([0-9a-f-]{36})')
    async delete(@Params() param: IDeleteCategoryDTO): Promise<DeleteCategoryResponse> {
        return await this._deleteCategoryUseCase.execute(param);
    }
}
