import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { ResendActivationUserUseCase } from '../domain/useCases/commands/ResendActivationUserUseCase';
import { ActiveUserCommandDTO } from '../domain/useCases/request/ActiveUserCommandDTO';
import { ResendActivationUserErrors } from '../domain/useCases/errors/ResendActivationUserErrors';

@JsonController('/v1/user')
export class ResendActivationUserController extends BaseController {
    constructor(
        private readonly _resendActivationUserUseCase = Container.get(ResendActivationUserUseCase),
    ) {super()}

    @Post('/resend-activation')
    async executeImpl(@Body() param: ActiveUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._resendActivationUserUseCase.execute(param);
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case ResendActivationUserErrors.EmailNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case ResendActivationUserErrors.UserStatusError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ResendActivationUserErrors.CannotSaveError:
                        return this.fail(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue().message)
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
