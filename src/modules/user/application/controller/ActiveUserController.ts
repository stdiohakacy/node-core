import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { ActiveUserCommandDTO } from '../../domain/useCases/request/ActiveUserCommandDTO';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { ActiveUserUseCase } from '../../domain/useCases/commands/ActiveUserUseCase';
import { ActiveUserErrors } from '../../domain/useCases/errors/ActiveUserErrors';

@JsonController('/v1/user')
export class ActiveUserController extends BaseController {
    constructor(
        private readonly _activeUserUseCase = Container.get(ActiveUserUseCase),
    ) {super()}

    @Post('/active')
    async executeImpl(@Body() param: ActiveUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._activeUserUseCase.execute(param);
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case ActiveUserErrors.EmailNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case ActiveUserErrors.UserStatusError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ActiveUserErrors.ActiveKeyInvalidError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ActiveUserErrors.ExpiredTimeError:
                        return this.clientError(res, resultValue.errorValue().message)
                    case ActiveUserErrors.CannotSaveError:
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
