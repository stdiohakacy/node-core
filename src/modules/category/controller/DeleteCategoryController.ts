import Container from 'typedi';
import { Response } from 'express';
import { Delete, JsonController, Params, Res } from "routing-controllers";
import { DeleteCategoryUseCase } from '../useCases/commands/delete/DeleteCategoryUseCase';
import { DeleteCategoryCommandDTO } from '../useCases/commands/delete/DeleteCategoryCommandDTO';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { DeleteCategoryErrors } from '../useCases/commands/delete/DeleteCategoryErrors';

@JsonController('/v1/categories')
export class DeleteCategoryController extends BaseController {
    constructor(
        private readonly _deleteCategoryUseCase: DeleteCategoryUseCase = Container.get(DeleteCategoryUseCase),
    ) {super()}

    @Delete('/:id([0-9a-f-]{36})')
    async executeImpl(@Params() param: DeleteCategoryCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._deleteCategoryUseCase.execute(param)
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case DeleteCategoryErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case DeleteCategoryErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue())
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
