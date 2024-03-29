import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Param, Put, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { UpdateCategoryUseCase } from '../application/commands/update/UpdateCategoryUseCase';
import { UpdateCategoryCommandDTO } from '../dtos/UpdateCategoryCommandDTO';
import { UpdateCategoryErrors } from '../application/commands/update/UpdateCategoryErrors';

@JsonController('/v1/categories')
export class UpdateCategoryController extends BaseController {
    constructor(
        private readonly _updateCategoryUseCase: UpdateCategoryUseCase = Container.get(UpdateCategoryUseCase),
    ) { super() }

    @Put('/:id([0-9a-f-]{36})')
    async executeImpl(
        @Body() param: UpdateCategoryCommandDTO,
        @Res() res: Response,
        @Param('id') id: string
    ): Promise<Response> {
        param.id = id
        try {
            const result = await this._updateCategoryUseCase.execute(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case UpdateCategoryErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case UpdateCategoryErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
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
