import { AuthenticateUseCase } from '../../domain/useCases/commands/AuthenticateUseCase';
import { BodyParam, HeaderParam, JsonController, Post, Res } from "routing-controllers";
import Container, { Service } from "typedi";
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { Response } from 'express';
import { AuthenticateErrors } from '../../domain/useCases/errors/AuthenticateErrors';
import { AuthenticateCommandDTO } from '../../domain/useCases/request/AuthenticateCommandDTO';

@Service()
@JsonController('/v1/auth')
export class AuthController extends BaseController {
    constructor(
        private readonly _authenticateUseCase = Container.get(AuthenticateUseCase),
    ) { super() }

    @Post('/')
    async executeImpl(
        @BodyParam('token') token: string,
        @Res() res: Response,
        @HeaderParam('authorization') authorization: string
    ): Promise<Response> {
        const param = new AuthenticateCommandDTO()
        if (authorization) {
            const parts = (authorization || '').split(' ');
            param.token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';
        }
        else if (token)
            param.token = token;

        try {
            const result = await this._authenticateUseCase.execute(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case AuthenticateErrors.TokenInvalidError:
                        return this.unAuthorized(res, resultValue.errorValue().message)
                    case AuthenticateErrors.TokenExpireTimeError:
                        return this.unAuthorized(res, resultValue.errorValue().message)
                    case AuthenticateErrors.AccessDeniedError:
                        return this.forbidden(res, resultValue.errorValue().message)
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
