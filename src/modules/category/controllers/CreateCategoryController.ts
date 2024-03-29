import Container from 'typedi';
import { Response } from 'express';
import { Body, getMetadataArgsStorage, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { CreateCategoryUseCase } from '../application/commands/create/CreateCategoryUseCase';
import { CreateCategoryCommandDTO } from '../dtos/CreateCategoryCommandDTO';
import { CreateCategoryErrors } from '../application/commands/create/CreateCategoryErrors';
import { routingControllersToSpec } from 'routing-controllers-openapi';

@JsonController('/v1/categories')
export class CreateCategoryController extends BaseController {
    constructor(
        private readonly _createCategoryUseCase: CreateCategoryUseCase = Container.get(CreateCategoryUseCase),
    ) {super()}

    @Post('/')
    async executeImpl(@Body() param: CreateCategoryCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createCategoryUseCase.execute(param)
            const resultValue = result.value
            if(result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateCategoryErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message.message)
                    default:
                        return this.fail(res, resultValue.errorValue().message.message)
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
const storage = getMetadataArgsStorage()
const spec = routingControllersToSpec(storage)
console.log(spec)