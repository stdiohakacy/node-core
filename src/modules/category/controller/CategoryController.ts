import { UpdateCategoryResponse } from './../useCases/updateCategory/UpdateCategoryResponse';
import { GetCategoryByIdResponse } from './../useCases/getCategoryById/GetCategoryByIdResponse';
import { GetCategoryByIdUseCase } from './../useCases/getCategoryById/GetCategoryByIdUseCase';
import { UpdateCategoryUseCase } from './../useCases/updateCategory/UpdateCategoryUseCase';
import { Body, Get, JsonController, Param, Params, Post, Put } from "routing-controllers";
import { CreateCategoryUseCase } from "../useCases/createCategory/CreateCategoryUseCase";
import { IGetCategoryByIdDTO } from '../useCases/getCategoryById/IGetCategoryById';
import { ICreateCategoryDTO } from '../useCases/createCategory/ICreateCategoryDTO';
import { CreateCategoryResponse } from '../useCases/createCategory/CreateCategoryResponse';
import { IUpdateCategoryDTO } from '../useCases/updateCategory/IUpdateCategoryDTO';

@JsonController('/v1/categories')
export class CategoryController {
    private _getCategoryByIdUseCase: GetCategoryByIdUseCase
    private _createCategoryUseCase: CreateCategoryUseCase
    private _updateCategoryUseCase: UpdateCategoryUseCase
    constructor() {
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
