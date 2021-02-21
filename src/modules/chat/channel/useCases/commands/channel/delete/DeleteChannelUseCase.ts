import { ChannelUserRepository } from './../../../../repositories/ChannelUserRepository';
import { DeleteChannelCommandDTO } from './DeleteChannelCommandDTO';
import { Inject, Service } from 'typedi';
import { ChannelId } from '../../../../domain/entity/ChannelId';
import { ChannelRepository } from '../../../../repositories/ChannelRepository';
import { DeleteChannelResponse } from './DeleteChannelResponse';
import { DeleteChannelErrors } from './DeleteChannelErrors';
import { IUseCaseCommandCQRS } from '../../../../../../../shared/core/IUseCase';
import { UniqueEntityId } from '../../../../../../../shared/domain/UniqueEntityId';
import { left, Result, right } from '../../../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../../../shared/core/ApplicationError';

@Service()
export class DeleteChannelUseCase implements IUseCaseCommandCQRS<
    DeleteChannelCommandDTO, 
    Promise<DeleteChannelResponse>
> {
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository;
    @Inject('channel_user.repository')
    private readonly _channelUserRepository: ChannelUserRepository;

    async execute(param: DeleteChannelCommandDTO): Promise<DeleteChannelResponse> {
        const idOrError = ChannelId.create(new UniqueEntityId(param.id))
        if (idOrError.isFailure)
            return left(Result.fail<ChannelId>(idOrError.error));

        const channelId = idOrError.getValue()

        try {
            const isExist = await this._channelRepository.getById(channelId.id.toString())
            if (!isExist)
                return left(new DeleteChannelErrors.NotFoundError(param.id))

            const isDeleted = await this._channelUserRepository.deleteChannel(channelId.id.toString())
            if (!isDeleted)
                return left(new DeleteChannelErrors.DataCannotSave())
            try {
                const isDeleted = await this._channelRepository.delete(param.id)
                if (!isDeleted)
                    return left(new DeleteChannelErrors.DataCannotSave())
                return right(Result.OK(isDeleted))
            }
            catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError())
            }
        }
        catch (error) {
            console.log(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
