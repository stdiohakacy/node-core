import { CreateMessageResponse } from './CreateMessageResponse';
import { CreateMessageUseCase } from './CreateMesasgeUseCase';
import Container from 'typedi';
import { Response } from 'express';
import { Authorized, Body, CurrentUser, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { CreateMessageErrors } from './CreateMessageErrors';
import { CreateMessageCommandDTO } from './CreateMessageCommandDTO';
import { UserAuthenticated } from '../../auth/useCases/command/authenticate/AuthenticateResponse';

@JsonController('/v1/chat')
export class CreateMessageController extends BaseController {
    constructor(
        private readonly _createMessageUseCase: CreateMessageUseCase = Container.get(CreateMessageUseCase)
    ) { super() }

    @Post('/messages')
    @Authorized()
    async executeImpl(
        @CurrentUser() userAuthenticated: UserAuthenticated,
        @Res() res: Response,
        @Body() param: CreateMessageCommandDTO
    ): Promise<Response> {
        param.userId = userAuthenticated.userId
        try {
            const result = await this._createMessageUseCase.execute(param)
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateMessageErrors.ChannelNotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case CreateMessageErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue().message)
                }
            }
            else
                return this.created(res, resultValue.getValue())
        }
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
