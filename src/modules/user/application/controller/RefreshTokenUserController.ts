import { RefreshTokenUserUseCase } from '../../domain/useCases/commands/RefreshTokenUserUseCase';
import Container from 'typedi';
import { Body, JsonController, Params, Post, Res } from "routing-controllers";
import { Response } from 'express';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { RefreshTokenUserCommandDTO } from '../../domain/useCases/request/RefreshTokenUserCommandDTO';
import { RefreshTokenUserErrors } from '../../domain/useCases/errors/RefreshTokenUserErrors';
import { LoginDTOResponse } from '../../../auth/domain/useCases/response/LoginResponse';

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
                        return this.notFound(res, resultValue.errorValue())
                    case RefreshTokenUserErrors.UserNotFoundError:
                        return this.notFound(res, resultValue.errorValue())
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
