import { UpdateCategoryResponse } from './UpdateCategoryResponse';
import { IUpdateCategoryDTO } from './IUpdateCategoryDTO';
import { UpdateCategoryUseCase } from './UpdateCategoryUseCase';
import { Body, JsonController, Param, Put } from "routing-controllers";

@JsonController('/v1/categories')
export class UpdateCategoryController {
    private _useCase: UpdateCategoryUseCase
    constructor() {
        this._useCase = new UpdateCategoryUseCase()
    }

    @Put('/:id([0-9a-f-]{36})')
    async update(@Param('id') id: string, @Body() param: IUpdateCategoryDTO): Promise<UpdateCategoryResponse> {
        param.id = id;
        return await this._useCase.execute(param);
    }
}
