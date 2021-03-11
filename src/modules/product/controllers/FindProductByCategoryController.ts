import Container from 'typedi';
import { Response } from 'express';
import { Get, JsonController, Param, QueryParams, Res } from 'routing-controllers';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { FindProductsByCategoryUseCase } from '../application/queries/find-by-category/FindProductsByCategoryUseCase';
import { FindProductsByCategoryQueryDTO } from '../dtos/FindProductsByCategoryQueryDTO';
import { FindProductsByCategoryErrors } from '../application/queries/find-by-category/FindProductsByCategoryErrors';

@JsonController('/v1/products')
export class FindProductsByCategory extends BaseController {
    constructor(
        private readonly _findCategoriesUseCase: FindProductsByCategoryUseCase = Container.get(FindProductsByCategoryUseCase),
    ) { super() }

    @Get('/category/:id([0-9a-f-]{36})')
    async executeImpl(
        @QueryParams() param: FindProductsByCategoryQueryDTO,
        @Res() res: Response,
        @Param('id') id: string
    ): Promise<Response> {
        param.categoryId = id
        try {
            const result = await this._findCategoriesUseCase.execute(param)
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case FindProductsByCategoryErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue().message)
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
