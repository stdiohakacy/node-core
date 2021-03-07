import Container from 'typedi';
import { Response } from 'express';
import { Body, Get, JsonController, Params, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { GetCategoryByIdUseCase } from '../application/queries/get-by-id/GetCategoryByIdUseCase';
import { GetCategoryByIdQueryDTO } from '../dtos/GetCategoryByIdQueryDTO';
import { GetCategoryByIdErrors } from '../application/queries/get-by-id/GetCategoryByIdError';

@JsonController('/v1/categories')
export class GetCategoryByIdController extends BaseController {
    constructor(
        private readonly _getCategoryByIdUseCase: GetCategoryByIdUseCase = Container.get(GetCategoryByIdUseCase),

    ) { super() }

    @Get('/:id([0-9a-f-]{36})')
    async executeImpl(@Params() param: GetCategoryByIdQueryDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._getCategoryByIdUseCase.execute(param)
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case GetCategoryByIdErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue())
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            } else {
                return this.OK(res, resultValue.getValue())
            }
        }
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}

