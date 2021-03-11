import Container from 'typedi';
import { Response } from 'express';
import { Delete, JsonController, Params, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { DeleteProductUseCase } from '../application/commands/delete/DeleteProductUseCase';
import { DeleteProductCommandDTO } from '../dtos/DeleteProductCommandDTO';
import { DeleteProdutErrors } from '../application/commands/delete/DeleteProdutErrors';

@JsonController('/v1/products')
export class DeleteProductController extends BaseController {
    constructor(
        private readonly _deleteProductUseCase: DeleteProductUseCase = Container.get(DeleteProductUseCase),
    ) { super() }

    @Delete('/:id([0-9a-f-]{36})')
    async executeImpl(
        @Params() param: DeleteProductCommandDTO,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const result = await this._deleteProductUseCase.execute(param)
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case DeleteProdutErrors.NotFoundError:
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
