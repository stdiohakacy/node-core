import { CreatePrivateMessageCommandDTO } from '../useCases/commands/create/CreatePrivateMessageCommandDTO';
import { UserAuthenticated } from '../../../auth/useCases/command/authenticate/AuthenticateResponse';
import Container from 'typedi';
import { Response } from 'express';
import { Authorized, Body, CurrentUser, JsonController, Post, Res } from "routing-controllers";
import { CreatePrivateMessageUseCase } from '../useCases/commands/create/CreatePrivateMessageUseCase';
import { CreatePrivateMessageErrors } from '../useCases/commands/create/CreatePrivateMessageErrors';
import { BaseController } from '../../../../shared/infra/http/models/BaseController';

@JsonController('/v1/chat')
export class CreatePrivateMessageController extends BaseController {
    constructor(
        private readonly _createPrivateMessageUseCase: CreatePrivateMessageUseCase = Container.get(CreatePrivateMessageUseCase)
    ) { super() }

    @Authorized()
    @Post('/private-messages')
    async executeImpl(
        @CurrentUser() userAuthenticated: UserAuthenticated,
        @Res() res: Response,
        @Body() param: CreatePrivateMessageCommandDTO
    ): Promise<Response> {
        param.fromUserId = userAuthenticated.userId
        try {
            const result = await this._createPrivateMessageUseCase.execute(param)
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreatePrivateMessageErrors.UserNotFoundError:
                        return this.notFound(res, resultValue.errorValue())
                    case CreatePrivateMessageErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue())
                    default:
                        return this.fail(res, resultValue.errorValue())
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
