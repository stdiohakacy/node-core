import { UpdateCategoryResponse } from '../useCases/update/UpdateCategoryResponse';
import { GetCategoryByIdResponse } from '../useCases/getById/GetCategoryByIdResponse';
import { GetCategoryByIdUseCase } from '../useCases/getById/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from '../useCases/update/UpdateCategoryUseCase';
import { Body, Get, JsonController, Param, Params, Post, Put } from "routing-controllers";
import { CreateCategoryUseCase } from "../useCases/create/CreateCategoryUseCase";
import { IGetCategoryByIdDTO } from '../useCases/getById/IGetCategoryById';
import { ICreateCategoryDTO } from '../useCases/create/ICreateCategoryDTO';
import { CreateCategoryResponse } from '../useCases/create/CreateCategoryResponse';
import { IUpdateCategoryDTO } from '../useCases/update/IUpdateCategoryDTO';
import { Service } from 'typedi';

@JsonController('/v1/categories')
export class CategoryController {
    private _getCategoryByIdUseCase: GetCategoryByIdUseCase
    private _createCategoryUseCase: CreateCategoryUseCase
    private _updateCategoryUseCase: UpdateCategoryUseCase
    constructor(
    ) {
        this._getCategoryByIdUseCase = new GetCategoryByIdUseCase()
        this._createCategoryUseCase = new CreateCategoryUseCase()
        this._updateCategoryUseCase = new UpdateCategoryUseCase()
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
}
