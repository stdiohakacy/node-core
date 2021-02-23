import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { CreateProductUseCase } from '../useCases/commands/create/CreateProductUseCase';
import { CreateProductCommandDTO } from '../useCases/commands/create/CreateProductCommandDTO';
import { CreateProductErrors } from '../useCases/commands/create/CreateProductErrors';

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

            console.log(resultValue)
            if(result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateProductErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
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
