import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { LoginUseCase } from '../../domain/useCases/commands/LoginUseCase';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';
import { LoginErrors } from '../../domain/useCases/errors/LoginErrors';
import { LoginCommandDTO } from '../../domain/useCases/request/LoginCommandDTO';

@JsonController('/v1/auth')
export class LoginController extends BaseController {
    constructor(
        private readonly _loginUseCase = Container.get(LoginUseCase),
    ) { super() }

    @Post('/login')
    async executeImpl(@Body() param: LoginCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._loginUseCase.execute(param);
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case LoginErrors.AccountInvalidError:
                        return this.unAuthorized(res, resultValue.errorValue().message)
                    case LoginErrors.AccountStatusError:
                        return this.unAuthorized(res, resultValue.errorValue().message)
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
