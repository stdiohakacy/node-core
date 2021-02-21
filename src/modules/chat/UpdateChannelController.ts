import { UpdateChannelCommandDTO } from './UpdateChannelCommandDTO';
import Container from 'typedi';
import { Response } from 'express';
import { Body, JsonController, Param, Put, Res } from "routing-controllers";
import { BaseController } from '../../shared/infra/http/models/BaseController';
import { UpdateChannelUseCase } from './UpdateChannelUseCase';
import { UpdateChannelErrors } from './UpdateChannelErrors';

@JsonController('/v1/chat')
export class UpdateChannelController extends BaseController {
    constructor(
        private readonly _updateChannelUseCase: UpdateChannelUseCase = Container.get(UpdateChannelUseCase),
    ) { super() }

    @Put('/channel/:id([0-9a-f-]{36})')
    async executeImpl(
        @Body() param: UpdateChannelCommandDTO,
        @Res() res: Response,
        @Param('id') id: string
    ): Promise<Response> {
        param.id = id
        try {
            const result = await this._updateChannelUseCase.execute(param);
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case UpdateChannelErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case UpdateChannelErrors.NameAlreadyExistsError:
                        return this.conflict(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else
                return this.OK(res, resultValue.getValue())
        } 
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
