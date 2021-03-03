import Container from 'typedi';
import { Response } from 'express';
import { Authorized, Get, JsonController, QueryParams, Res } from "routing-controllers";
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { FindCategoriesUseCase } from '../../domain/useCases/queries/FindCategoriesUseCase';
import { FindCategoriesQueryDTO } from '../../domain/useCases/request/FindCategoriesQueryDTO';

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
