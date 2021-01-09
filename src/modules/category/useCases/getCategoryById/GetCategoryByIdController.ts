import { GetCategoryByIdResponse } from './GetCategoryByIdResponse';
import { GetCategoryByIdUseCase } from './GetCategoryByIdUseCase';
import { Get, JsonController, Params } from "routing-controllers";
import { IGetCategoryByIdDTO } from './IGetCategoryById';

@JsonController('/v1/categories')
export class GetCategoryByIdController {
    private _useCase: GetCategoryByIdUseCase

    constructor() {
        this._useCase = new GetCategoryByIdUseCase()
    }

    @Get('/:id([0-9a-f-]{36})')
    async getById(@Params() param: IGetCategoryByIdDTO): Promise<GetCategoryByIdResponse> {
        return await this._useCase.execute(param);
    }
}
