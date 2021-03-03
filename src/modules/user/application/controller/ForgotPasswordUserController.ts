import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { ForgotPasswordUserUseCase } from '../../domain/useCases/commands/ForgotPasswordUserUseCase';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { ForgotPasswordUserCommandDTO } from '../../domain/useCases/request/ForgotPasswordUserCommandDTO';
import { ForgotPasswordUserErrors } from '../../domain/useCases/errors/ForgotPasswordUserErrors';

@JsonController('/v1/user')
export class ForgotPasswordUserController extends BaseController {
    constructor(
        private readonly _forgotPasswordUserUseCase = Container.get(ForgotPasswordUserUseCase),
    ) {super()}

    @Post('/forgot-password')
    async executeImpl(@Body() param: ForgotPasswordUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._forgotPasswordUserUseCase.execute(param);
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case ForgotPasswordUserErrors.EmailNotFoundError:
                        return this.conflict(res, resultValue.errorValue())
                    case ForgotPasswordUserErrors.DataInvalidError:
                        return this.clientError(res, resultValue.errorValue())
                    case ForgotPasswordUserErrors.CannotSaveError:
                        return this.fail(res, resultValue.errorValue())
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else 
                return this.OK(res, resultValue.getValue())
        }
        catch (error) {
            console.error('ERR', error)
            return this.fail(res, error)
        }
    }
}
