import Container from 'typedi';
import { Response } from 'express';
import { Authorized, Body, BodyParam, CurrentUser, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { GetChannelSingleUseCase } from '../useCases/queries/channel/get-single/GetChannelSingleUseCase';
import { GetChannelSingleQueryDTO } from '../useCases/queries/channel/get-single/GetChannelSingleQueryDTO';
import { GetChannelSingleErrors } from '../useCases/queries/channel/get-single/GetChannelSingleErrors';
import { UserAuthenticated } from '../../auth/useCases/command/authenticate/AuthenticateResponse';

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
                    case GetChannelSingleErrors.TokenInvalidError:
                        return this.unAuthorized(res, resultValue.errorValue().message)
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
