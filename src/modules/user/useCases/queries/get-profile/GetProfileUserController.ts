import { UserAuthenticated } from './../../../../auth/useCases/command/authenticate/AuthenticateResponse';
import Container from 'typedi';
import { Response } from 'express';
import { Authorized, CurrentUser, Get, JsonController, Params, Res } from "routing-controllers";
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { GetProfileUserUseCase } from './GetProfileUserUseCase';
import { GetProfileUserQueryDTO } from './GetProfileUserQueryDTO';
import { GetProfileUserErrors } from './GetProfileUserErrors';

@JsonController('/v1/users')
export class GetProfileUserController extends BaseController {
    constructor(
        private readonly _getProfileUserUseCase: GetProfileUserUseCase = Container.get(GetProfileUserUseCase),
    ) {super()}

    @Get('/me')
    @Authorized()
    async executeImpl(@CurrentUser() userAuthenticated: UserAuthenticated, @Res() res: Response): Promise<Response> {
        const param = new GetProfileUserQueryDTO()
        param.id = userAuthenticated.userId

        try {
            const result = await this._getProfileUserUseCase.execute(param);
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case GetProfileUserErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue())
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

