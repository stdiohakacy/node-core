import { DeleteChannelCommandDTO } from './../useCases/commands/channel/delete/DeleteChannelCommandDTO';
import { DeleteChannelUseCase } from './../useCases/commands/channel/delete/DeleteChannelUseCase';
import { Body, Delete, JsonController, Param, Params, Res } from "routing-controllers";
import { BaseController } from "../../../shared/infra/http/models/BaseController";
import Container from 'typedi';
import { Response } from 'express'
import { DeleteChannelErrors } from '../useCases/commands/channel/delete/DeleteChannelErrors';

@JsonController('/v1/chat')
export class DeleteChannelController extends BaseController {
    constructor(
        private readonly _deleteChannelUseCase: DeleteChannelUseCase = Container.get(DeleteChannelUseCase),
    ) { super() }

    @Delete('/channel/:id([0-9a-f-]{36})')
    async executeImpl(
        @Params() param: DeleteChannelCommandDTO, 
        @Res() res: Response
    ): Promise<Response> {
        try {
            const result = await this._deleteChannelUseCase.execute(param)
            const resultValue = result.value

            if(result.isLeft()) {
                switch(resultValue.constructor) {
                    case DeleteChannelErrors.NotFoundError:
                        return this.notFound(res, resultValue.errorValue().message)
                    case DeleteChannelErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue().message)
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            } else 
                return this.OK(res, resultValue.getValue())
        } 
        catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
