import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { ResetPasswordUserUseCase } from './../useCases/commands/reset-password/ResetPasswordUserUseCase';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { ResetPasswordUserCommandDTO } from '../useCases/commands/reset-password/ResetPasswordUserCommandDTO';
import { ResetPasswordUserErrors } from '../useCases/commands/reset-password/ResetPasswordUserErrors';

@JsonController('/v1/user')
export class ResetPasswordUserController extends BaseController {
    constructor(
        private readonly _resetPasswordUserUseCase = Container.get(ResetPasswordUserUseCase),
    ) {super()}

    @Post('/reset-password')
    async executeImpl(@Body() param: ResetPasswordUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._resetPasswordUserUseCase.execute(param);
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case ResetPasswordUserErrors.EmailNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case ResetPasswordUserErrors.ForgotKeyInvalidError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ResetPasswordUserErrors.ExpiredTimeError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ResetPasswordUserErrors.CannotSaveError:
                        return this.fail(res, resultValue.errorValue().message)
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
