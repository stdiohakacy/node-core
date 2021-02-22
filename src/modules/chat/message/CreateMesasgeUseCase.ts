import { MessageMapper } from './MessageMapper';
import { left, Result, right } from './../../../shared/core/Result';
import { MessageContent } from './MessageContent';
import { CreateMessageResponse } from './CreateMessageResponse';
import { MessageRepository } from './MessageRepository';
import { Inject, Service } from "typedi"
import { CreateMessageCommandDTO } from './CreateMessageCommandDTO';
import { ChannelRepository } from '../channel/repositories/ChannelRepository';
import { CreateMessageErrors } from './CreateMessageErrors';
import { ApplicationError } from '../../../shared/core/ApplicationError';
import { Message } from './Message';
import { ChannelId } from '../channel/domain/entity/ChannelId';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { UserId } from '../../user/domain/entity/UserId';
import { IUseCaseCommandCQRS } from '../../../shared/core/IUseCase';

@Service()
export class CreateMessageUseCase implements IUseCaseCommandCQRS<CreateMessageCommandDTO, Promise<CreateMessageResponse>> {
    @Inject('message.repository')
    private readonly _messageRepository: MessageRepository
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository

    async execute(param: CreateMessageCommandDTO): Promise<CreateMessageResponse> {
        const messageContentOrError = MessageContent.create({ value: param.content })
        const channelIdOrError = ChannelId.create(new UniqueEntityId(param.channelId))

        const dtoResults = Result.combine([
            messageContentOrError,
            channelIdOrError
        ])
        if(dtoResults.isFailure)
            return left(Result.fail(dtoResults.error))
        
        const content = messageContentOrError.getValue()
        const channelId = channelIdOrError.getValue()

        try {
            const isChannelExist = await this._channelRepository.isChannelExist(channelId.id.toString())
            if(!isChannelExist)
                return left(new CreateMessageErrors.ChannelNotFoundError())
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
        const messageOrError = Message.create({
            content,
            channelId: ChannelId.create(new UniqueEntityId(param.channelId)).getValue(),
            userId: UserId.create(new UniqueEntityId(param.userId)).getValue()
        })

        if(messageOrError.isFailure)
            return left(Result.fail(messageOrError.error))

        const message = messageOrError.getValue()
        const messageDb = MessageMapper.toPersistence(message)
        try {
            const isCreated = await this._messageRepository.create(messageDb)
            if(!isCreated)
                return left(new CreateMessageErrors.DataCannotSave())
            return right(Result.OK(isCreated))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
