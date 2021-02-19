import Container from 'typedi';
import { Response } from 'express';
import { Authorized, Body, BodyParam, CurrentUser, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { UserAuthenticated } from '../../auth/useCases/command/authenticate/AuthenticateResponse';
import { GetChannelSingleUseCase } from '../useCases/commands/channel/getSingle/GetChannelSingleUseCase';
import { GetChannelSingleQueryDTO } from '../useCases/commands/channel/getSingle/GetChannelSingleQueryDTO';
import { GetChannelSingleErrors } from '../useCases/commands/channel/getSingle/GetChannelSingleErrors';

@JsonController('/v1/chat')
export class GetChannelSingleController extends BaseController {
    constructor(
        private readonly _getChannelSingleUseCase: GetChannelSingleUseCase = Container.get(GetChannelSingleUseCase),
    ) {super()}

    @Post('/channel/get-single')
    @Authorized()
    async executeImpl(@CurrentUser() userAuthenticated: UserAuthenticated, @Res() res: Response, @BodyParam('toUserId') toUserId: string): Promise<Response> {
        const param = new GetChannelSingleQueryDTO()
        param.toUserId = toUserId
        param.userAuthenticated = userAuthenticated

        try {
            const result = await this._getChannelSingleUseCase.execute(param);
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case GetChannelSingleErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
                    case GetChannelSingleErrors.ReceiverNotfoundError:
                        return this.notFound(res, resultValue.errorValue().message)
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
