import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { CreateCategoryUseCase } from "../../domain/useCases/commands/CreateCategoryUseCase";
import { CreateCategoryCommandDTO } from '../../domain/useCases/handlers/dtos/CreateCategoryCommandDTO';
import { CreateCategoryErrors } from "../../domain/useCases/handlers/errors/CreateCategoryErrors";
import { BaseController } from '../../../../shared/infra/http/models/BaseController';

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
                        return this.conflict(res, resultValue.errorValue())
                    default:
                        return this.fail(res, resultValue.errorValue())
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
