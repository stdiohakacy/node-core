import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { ActiveUserCommandDTO } from '../useCases/commands/active/ActiveUserCommandDTO';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { ResendActivationUserUseCase } from '../useCases/commands/resend-activation/ResendActivationUserUseCase';
import { ResendActivationUserErrors } from '../useCases/commands/resend-activation/ResendActivationUserErrors';

@JsonController('/v1')
export class ResendActivationUserController extends BaseController {
    constructor(
        private readonly _resendActivationUserUseCase = Container.get(ResendActivationUserUseCase),
    ) {super()}

    @Post('/resend-active')
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
