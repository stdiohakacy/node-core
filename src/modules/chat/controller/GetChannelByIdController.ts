import Container from 'typedi';
import { Response } from 'express';
import { Body, BodyParam, CurrentUser, Get, JsonController, Param, Params, Res } from "routing-controllers";
import { GetChannelByIdUseCase } from '../useCases/queries/getById/GetChannelByIdUseCase';
import { BaseController } from '../../../shared/infra/http/models/BaseController';
import { GetChannelByIdErrors } from '../useCases/queries/getById/GetChannelByIdErrors';
import { GetChannelByIdDTO } from '../useCases/queries/getById/GetChannelByIdDTO';
import { UserAuthenticated } from '../../auth/useCases/command/authenticate/AuthenticateResponse';

@JsonController('/v1/chat')
export class GetChannelByIdController extends BaseController {
    constructor(
        private readonly _getChannelByIdUseCase: GetChannelByIdUseCase = Container.get(GetChannelByIdUseCase),
    ) { super() }

    @Get('/channel/:id([0-9a-f-]{36})')
    async executeImpl(
        @CurrentUser() userAuthenticated: UserAuthenticated, 
        @Res() res: Response, 
        @Param('id') id: string
    ): Promise<Response> {
        const param = new GetChannelByIdDTO()
        param.id = id
        param.userAuthenticated = userAuthenticated

        try {
            const result = await this._getChannelByIdUseCase.execute(param)
            const resultValue = result.value
            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case GetChannelByIdErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            } else {
                return this.OK(res, resultValue.getValue())
            }
        }
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}

