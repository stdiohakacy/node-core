import { LoginDTOResponse } from './../../auth/useCases/command/login/LoginResponse';
import { RefreshTokenUserUseCase } from './../useCases/commands/refresh-token/RefreshTokenUserUseCase';
import Container from 'typedi';
import { Body, JsonController, Params, Post, Res } from "routing-controllers";
import { Response } from 'express';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { RefreshTokenUserCommandDTO } from '../useCases/commands/refresh-token/RefreshTokenUserCommandDTO';
import { RefreshTokenUserErrors } from '../useCases/commands/refresh-token/RefreshTokenUserErrors';

@JsonController('/v1/user')
export class RefreshTokenUserController extends BaseController {
    constructor(
        private readonly _refreshTokenUserUseCase = Container.get(RefreshTokenUserUseCase),
    ) { super() }

    // @Authorized()
    @Post('/refresh-token')
    async executeImpl(@Body() param: RefreshTokenUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            console.log(param)
            const result = await this._refreshTokenUserUseCase.execute(param);
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case RefreshTokenUserErrors.TokenNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case RefreshTokenUserErrors.UserNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else {
                const accessToken = resultValue.getValue()
                return this.OK<LoginDTOResponse>(res, {
                    refreshToken: param.refreshToken,
                    accessToken
                })
            }
        }
        catch (error) {
            console.error('ERR', error)
            return this.fail(res, error)
        }
    }
}
