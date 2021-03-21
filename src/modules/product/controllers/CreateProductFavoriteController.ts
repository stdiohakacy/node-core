import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { CreateProductErrors } from '../application/commands/create/CreateProductErrors';
import { CreateProductFavoriteUseCase } from '../components/favorite/application/commands/create/CreateProductFavoriteUseCase';
import { CreateProductFavoriteCommandDTO } from '../components/favorite/dtos/CreateProductFavoriteCommandDTO';
import { CreateProductFavoriteErrors } from '../components/favorite/application/commands/create/CreateProductFavoriteErrors';

@JsonController('/v1/products')
export class CreateProductFavoriteController extends BaseController {
    constructor(
        private readonly _createProductFavoriteUseCase: CreateProductFavoriteUseCase = Container.get(CreateProductFavoriteUseCase)
    ) { super() }

    @Post('/favorite')
    async executeImpl(@Body() param: CreateProductFavoriteCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createProductFavoriteUseCase.execute(param)
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateProductFavoriteErrors.AlreadyExist:
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
