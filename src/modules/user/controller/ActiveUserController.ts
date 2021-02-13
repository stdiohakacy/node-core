import { ActiveUserCommandDTO } from '../useCases/commands/active/ActiveUserCommandDTO';
import { SystemError, MessageError } from '../../../shared/exceptions/SystemError';
import { SignUpUserResponse } from '../useCases/commands/signup/SignUpUserResponse';
import { SignUpUserUseCase } from '../useCases/commands/signup/SignUpUserUseCase';
import { SignUpUserCommandDTO } from '../useCases/commands/signup/SignUpUserCommandDTO';
import { Body, JsonController, Post, Res } from "routing-controllers";
import Container from 'typedi';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { Response } from 'express';
import { SignUpUserErrors } from '../useCases/commands/signup/SignUpUserErrors';
import { ApplicationError } from '../../../shared/core/ApplicationError';
import { ActiveUserUseCase } from '../useCases/commands/active/ActiveUserUseCase';
import { ActiveUserErrors } from '../useCases/commands/active/ActiveUserErrors';
import { ResendActivationUserUseCase } from '../useCases/commands/resend-activation/ResendActivationUserUseCase';
import { ResendActivationUserErrors } from '../useCases/commands/resend-activation/ResendActivationUserErrors';

@JsonController('/v1')
export class ActiveUserController extends BaseController {
    constructor(
        // private readonly _signUpUserUseCase = Container.get(SignUpUserUseCase),
        private readonly _activeUserUseCase = Container.get(ActiveUserUseCase),
        // private readonly _resendActivationUserUseCase = Container.get(ResendActivationUserUseCase),
    ) {
        super()
    }

    // @Post('/register')
    // async executeImpl(@Body() param: SignUpUserCommandDTO, @Res() res: Response): Promise<Response> {
    //     try {
    //         const result = await this._signUpUserUseCase.execute(param);
    //         const resultValue = result.value
    //         if(result.isLeft()) {
    //             switch(resultValue.constructor) {
    //                 case SignUpUserErrors.EmailAlreadyExistsError:
    //                     return this.conflict(res, resultValue.errorValue().message)
    //                 case SignUpUserErrors.DataCannotSave:
    //                     return this.fail(res, result.value.errorValue())
    //                 default:
    //                     return this.fail(res, resultValue.errorValue())
    //             }
    //         }
    //         else 
    //             return this.OK(res, resultValue.getValue())
    //     } 
    //     catch (error) {
    //         console.error('ERR', error)
    //         return this.fail(res, error)
    //     }
    // }

    @Post('/active')
    async executeImpl(@Body() param: ActiveUserCommandDTO, @Res() res: Response): Promise<Response> {
        // try {
        //     const result = await this._activeUserUseCase.execute(param);
        //     const resultValue = result.value
            
        //     if(result.isLeft()) {
        //         switch(resultValue.constructor) {
        //             case ActiveUserErrors.EmailNotFoundError:
        //                 return this.notFound(res, resultValue.errorValue().message)
        //             case ActiveUserErrors.ActiveKeyInvalidError:
        //                 return this.clientError(res, resultValue.errorValue().message)
        //             case ActiveUserErrors.ExpiredTimeError:
        //                 return this.clientError(res, resultValue.errorValue().message)
        //             case ActiveUserErrors.UserStatusError:
        //                 return this.clientError(res, resultValue.errorValue().message)
        //             case ActiveUserErrors.CannotSaveError:
        //                 return this.fail(res, resultValue.errorValue())
        //             default:
        //                 return this.fail(res, resultValue.errorValue())
        //         }
        //     } else
        //         return this.OK(res, resultValue.getValue())
        // }
        // catch (error) {
        //     console.error('ERROR', error)
        //     return this.fail(res, error)
        // }

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

    // @Post('/resend-active')
    // async resendActivation(@Body() param: ActiveUserCommandDTO, @Res() res: Response): Promise<Response> {
    //     try {
    //         const result = await this._resendActivationUserUseCase.execute(param);
    //         const resultValue = result.value
            
    //         if(result.isLeft()) {
    //             switch(resultValue.constructor) {
    //                 case ResendActivationUserErrors.CannotSaveError:
    //                     throw new SystemError(MessageError.DATA_CANNOT_SAVE)
    //                 case ResendActivationUserErrors.NotFoundError:
    //                     throw new SystemError(MessageError.PARAM_NOT_FOUND, 'user')
    //                 case ResendActivationUserErrors.UserStatusError:
    //                     throw new SystemError(MessageError.PARAM_INCORRECT, 'user status')
    //                 default:
    //                     return this.fail(res, resultValue.errorValue())
    //             }
    //         } else {
    //             return this.OK(res, resultValue.getValue())
    //         }
    //     }
    //     catch (error) {
    //         console.error('ERROR', error)
    //         return this.fail(res, error)
    //     }
    // }
}
