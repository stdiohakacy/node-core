import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { CreateProductCommandDTO } from '../dtos/CreateProductCommandDTO';
import { CreateProductErrors } from '../application/commands/create/CreateProductErrors';
import { CreateProductUseCase } from '../application/commands/create/CreateProductUseCase';

@JsonController('/v1/products')
export class CreateProductController extends BaseController {
    constructor(
        private readonly _createProductUseCase: CreateProductUseCase = Container.get(CreateProductUseCase)
    ) { super() }

    @Post('/')
    async executeImpl(@Body() param: CreateProductCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createProductUseCase.execute(param)
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateProductErrors.CategoryNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case CreateProductErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
                    case CreateProductErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue().message)
                }
            }
            else
                return this.created(res, resultValue.getValue())
        }
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
