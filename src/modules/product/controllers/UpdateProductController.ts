import { UpdateProductCommandDTO } from './../dtos/UpdateProductCommandDTO';
import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Param, Post, Put, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { UpdateProductUseCase } from '../application/commands/update/UpdateProductUseCase';
import { UpdateProductErrors } from '../application/commands/update/UpdateProductErrors';

@JsonController('/v1/products')
export class CreateProductController extends BaseController {
    constructor(
        private readonly _updateProductUseCase: UpdateProductUseCase = Container.get(UpdateProductUseCase)
    ) { super() }

    @Put('/:id([0-9a-f-]{36})')
    async executeImpl(
        @Body() param: UpdateProductCommandDTO,
        @Res() res: Response,
        @Param('id') id: string
    ): Promise<Response> {
        param.id = id
        try {
            const result = await this._updateProductUseCase.execute(param)
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case UpdateProductErrors.CategoryNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case UpdateProductErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
                    case UpdateProductErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case UpdateProductErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue().message)
                }
            }
            else
                return this.OK(res, resultValue.getValue())
        }
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
