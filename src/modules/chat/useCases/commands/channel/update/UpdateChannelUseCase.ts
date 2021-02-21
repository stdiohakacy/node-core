import { ChannelDb } from '../../../../infra/databases/typeorm/entities/ChannelDb';
import { ChannelId } from '../../../../domain/entity/ChannelId';
import { UpdateChannelResponse } from './UpdateChannelResponse';
import { Inject, Service } from 'typedi';
import { IUseCaseCommandCQRS } from '../../../../../../shared/core/IUseCase';
import { ChannelRepository } from '../../../../repositories/ChannelRepository';
import { UpdateChannelCommandDTO } from './UpdateChannelCommandDTO';
import { ChannelName } from '../../../../domain/valueObjects/ChannelName';
import { ChannelDescription } from '../../../../domain/valueObjects/ChannelDescription';
import { left, Result, right } from '../../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { UpdateChannelErrors } from './UpdateChannelErrors';
import { Channel, IChannelProps } from '../../../../domain/aggregateRoot/Channel';
import { ChannelMapper } from '../../../../infra/ChannelMapper';

@Service()
export class UpdateChannelUseCase implements IUseCaseCommandCQRS<
    UpdateChannelCommandDTO,
    Promise<UpdateChannelResponse>
> {
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository;

    async execute(param: UpdateChannelCommandDTO): Promise<UpdateChannelResponse> {
        const channelIdOrError = param.id && ChannelId.create(new UniqueEntityId(param.id))
        const channelNameOrError = param.name && ChannelName.create({ value: param.name })
        const channelDescriptionOrError = param.description && ChannelDescription.create({ value: param.description })
        const channelProps: IChannelProps = {}

        const results = []
        results.push(channelIdOrError)
        param.name && results.push(channelNameOrError)
        param.description && results.push(channelDescriptionOrError)

        const dtoResults = Result.combine(results)
        if(dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))
        if(param.name)
            channelProps.name = channelNameOrError.getValue()
        if (param.description) 
            channelProps.description = channelDescriptionOrError.getValue()
        if(param.isPrivate)
            channelProps.isPrivate = param.isPrivate

        const channelOrError = Channel.create(channelProps)
        if(channelOrError.isFailure)
            return left(Result.fail(channelOrError.error!.toString()));

        const id = channelIdOrError.getValue().id.toString()
        const channel = channelOrError.getValue();
        const channelDb = ChannelMapper.toPersistence(channel)

        try {
            const isExist = await this._channelRepository.isChannelExist(id)
            if (!isExist)
                return left(new UpdateChannelErrors.NotFoundError(param.id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
        try {
            const isUpdated = await this._channelRepository.update(param.id, channelDb)
            if (!isUpdated)
                return left(new UpdateChannelErrors.DataCannotSave())
            return right(Result.OK(isUpdated))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
