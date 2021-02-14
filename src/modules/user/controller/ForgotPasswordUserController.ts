import { ForgotPasswordUserUseCase } from './../useCases/commands/forgot-password/ForgotPasswordUserUseCase';
import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { ActiveUserCommandDTO } from '../useCases/commands/active/ActiveUserCommandDTO';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { ForgotPasswordUserErrors } from '../useCases/commands/forgot-password/ForgotPasswordUserErrors';
import { ForgotPasswordUserCommandDTO } from '../useCases/commands/forgot-password/ForgotPasswordUserCommandDTO';

@JsonController('/v1')
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
                        return this.conflict(res, resultValue.errorValue().message)
                    case ForgotPasswordUserErrors.DataInvalidError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ForgotPasswordUserErrors.CannotSaveError:
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
