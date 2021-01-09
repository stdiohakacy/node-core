import { DeleteCategoryUseCase } from './DeleteCategoryUseCase';
import { Delete, JsonController, Params } from "routing-controllers"
import { IDeleteCategoryDTO } from './IDeleteCategoryDTO';
import { DeleteCategoryResponse } from './DeleteCategoryResponse';

@JsonController('/v1/categories')
export class DeleteCategoryController {
    private _useCase: DeleteCategoryUseCase
    constructor() {
        this._useCase = new DeleteCategoryUseCase()
    }

    @Delete('/:id([0-9a-f-]{36})')
    async delete(@Params() param: IDeleteCategoryDTO): Promise<DeleteCategoryResponse> {
        return await this._useCase.execute(param)
    }
}
