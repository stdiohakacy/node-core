import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { CreateCategoryUseCase } from "../useCases/commands/create/CreateCategoryUseCase";
import { CreateCategoryCommandDTO } from '../useCases/commands/create/CreateCategoryCommandDTO';
import { CreateCategoryErrors } from "../useCases/commands/create/CreateCategoryErrors";
import { BaseController } from '../../../shared/infra/http/models/BaseController';

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
                const error = result.value

                switch (error.constructor) {
                    case CreateCategoryErrors.NameAlreadyExistsError:
                        return this.conflict(res, error.errorValue().message)
                    default:
                        return this.fail(res, error.errorValue().message)
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
