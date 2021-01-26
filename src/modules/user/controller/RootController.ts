import { SystemError, MessageError } from './../../../shared/exceptions/SystemError';
import { SignUpUserResponse } from '../useCases/commands/signup/SignUpUserResponse';
import { SignUpUserUseCase } from '../useCases/commands/signup/SignUpUserUseCase';
import { SignUpUserCommandDTO } from '../useCases/commands/signup/SignUpUserCommandDTO';
import { Body, JsonController, Post, Res } from "routing-controllers";
import Container from 'typedi';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { Response } from 'express';
import { SignUpUserErrors } from '../useCases/commands/signup/SignUpUserErrors';
import { ApplicationError } from '../../../shared/core/ApplicationError';

@JsonController('/v1')
export class RootController extends BaseController {
    constructor(
        private readonly _signUpUserUseCase: SignUpUserUseCase = Container.get(SignUpUserUseCase),
    ) {
        super()
    }

    @Post('/register')
    async register(@Body() param: SignUpUserCommandDTO, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._signUpUserUseCase.execute(param);
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case SignUpUserErrors.EmailAlreadyExistsError:
                        throw new SystemError(MessageError.PARAM_EXISTED, 'email')
                    case SignUpUserErrors.CannotSaveError:
                        throw new SystemError(MessageError.DATA_CANNOT_SAVE)
                    case ApplicationError.UnexpectedError:
                        throw new SystemError(MessageError.SOMETHING_WRONG)
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else {
                return this.OK(res, resultValue.getValue())
            }
        } 
        catch (error) {
            console.error('ERR', error)
            return this.fail(res, error)
        }
    }
}
