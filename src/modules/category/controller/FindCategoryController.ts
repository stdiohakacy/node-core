import Container from 'typedi';
import { Response } from 'express';
import { Get, JsonController, QueryParams, Res } from "routing-controllers";
import { FindCategoriesUseCase } from './../useCases/queries/find/FindCategoriesUseCase';
import { FindCategoriesQueryDTO } from './../useCases/queries/find/FindCategoriesQueryDTO';
import { BaseController } from '../../../shared/infra/http/models/BaseController';

@JsonController('/v1/categories')
export class FindCategoryController extends BaseController {
    constructor(
        private readonly _findCategoriesUseCase: FindCategoriesUseCase = Container.get(FindCategoriesUseCase),
    ) {super()}

    @Get('/')
    async executeImpl(@QueryParams() param: FindCategoriesQueryDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._findCategoriesUseCase.execute(param)
            const resultValue = result.value

            return this.OK(res, resultValue.getValue())
        }
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
