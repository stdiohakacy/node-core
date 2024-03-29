import { LogoutUserUseCase } from '../domain/useCases/commands/LogoutUserUseCase';
import Container from 'typedi';
import { CurrentUser, JsonController, Post, Res } from "routing-controllers";
import { Response } from 'express';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { UserAuthenticated } from '../../auth/domain/useCases/response/AuthenticateResponse';
import { LogoutUserCommandDTO } from '../domain/useCases/request/LogoutUserCommandDTO';
import { LogoutUserErrors } from '../domain/useCases/errors/LogoutUserErrors';

@JsonController('/v1/user')
export class LogoutUserController extends BaseController {
    constructor(
        private readonly _logoutUserUseCase = Container.get(LogoutUserUseCase),
    ) { super() }

    // @Authorized()
    @Post('/logout')
    async executeImpl(
        @CurrentUser() userAuthenticated: UserAuthenticated,
        @Res() res: Response
    ): Promise<Response> {
        if (!userAuthenticated)
            return this.OK(res, true)

        const param = new LogoutUserCommandDTO()
        param.userId = userAuthenticated.userId
        try {
            const result = await this._logoutUserUseCase.execute(param);
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case LogoutUserErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
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
