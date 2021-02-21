import { ChannelId } from './../../../domain/entity/ChannelId';
import { ChannelRepository } from '../../../repositories/ChannelRepository';
import { Inject, Service } from "typedi";
import { GetChannelByIdDTO } from './GetChannelByIdDTO';
import { GetChannelByIdResponse } from './GetChannelByIdResponse';
import { GetChannelByIdErrors } from './GetChannelByIdErrors';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { left, Result, right } from '../../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';

@Service()
export class GetChannelByIdUseCase {
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository

    async execute(param: GetChannelByIdDTO): Promise<GetChannelByIdResponse> {
        const idOrError = ChannelId.create(new UniqueEntityId(param.id))
        if(idOrError.isFailure)
            return left(Result.fail(idOrError.error));

        const channelId = idOrError.getValue()

        try {
            const channel = await this._channelRepository
                .getChannelById(
                    channelId.id.toString(), 
                    param.userAuthenticated
                )
            
            if(!channel)
                return left(new GetChannelByIdErrors.NotFoundError(channelId.id.toString()))

            return right(Result.OK(channel));
        } 
        catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
