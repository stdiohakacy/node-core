import Container from 'typedi';
import { Response } from 'express';
import { Delete, JsonController, Params, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { DeleteProdutErrors } from '../application/commands/delete/DeleteProdutErrors';
import { DeleteProductFavoriteUseCase } from '../favorite/application/commands/delete/DeleteProductFavoriteUseCase';
import { DeleteProductFavoriteCommandDTO } from '../favorite/dtos/DeleteProductFavoriteCommandDTO';
import { DeleteProductFavoriteErrors } from '../favorite/application/commands/delete/DeleteProductFavoriteErrors';

@JsonController('/v1/products')
export class DeleteProductFavoriteController extends BaseController {
    constructor(
        private readonly _deleteProductFavoriteUseCase: DeleteProductFavoriteUseCase = Container.get(DeleteProductFavoriteUseCase),
    ) { super() }

    @Delete('/favorite/:id([0-9a-f-]{36})')
    async executeImpl(
        @Params() param: DeleteProductFavoriteCommandDTO,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const result = await this._deleteProductFavoriteUseCase.execute(param)
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case DeleteProductFavoriteErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case DeleteProdutErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
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
