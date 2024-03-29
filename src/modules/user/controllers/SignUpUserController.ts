import Container from 'typedi';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { Response } from 'express';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { SignUpUserUseCase } from '../domain/useCases/commands/SignUpUserUseCase';
import { SignUpUserCommandDTO } from '../domain/useCases/request/SignUpUserCommandDTO';
import { SignUpUserErrors } from '../domain/useCases/errors/SignUpUserErrors';

@JsonController('/v1/user')
export class SignUpUserController extends BaseController {
    constructor(
        private readonly _signUpUserUseCase = Container.get(SignUpUserUseCase),
    ) { super() }

    @Post('/register')
    async executeImpl(@Body() param: SignUpUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._signUpUserUseCase.execute(param);
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case SignUpUserErrors.EmailAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
                    case SignUpUserErrors.DataCannotSave:
                        return this.fail(res, result.value.errorValue())
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
