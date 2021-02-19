import { Inject, Service } from "typedi";
import { UserRepository } from './../../../../../user/repositories/UserRepository';
import { left, Result, right } from './../../../../../../shared/core/Result';
import { IUseCaseQueryCQRS } from "../../../../../../shared/core/IUseCase";
import { ChannelRepository } from "../../../../repositories/ChannelRepository";
import { GetChannelSingleQueryDTO } from "./GetChannelSingleQueryDTO";
import { GetChannelSingleResponse } from "./GetChannelSingleResponse";
import { GetChannelSingleErrors } from './GetChannelSingleErrors';
import { Channel } from '../../../../domain/aggregateRoot/Channel';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { ChannelMapper } from "../../../../infra/ChannelMapper";
import { ChannelUserRepository } from '../../../../repositories/ChannelUserRepository';
import { ChannelUser } from '../../../../domain/entity/ChannelUser';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { UserId } from '../../../../../user/domain/entity/UserId';
import { ChannelId } from '../../../../domain/entity/ChannelId';
import { ChannelUserMapper } from '../../../../infra/ChannelUserMapper';
import { ChannelUsers } from "../../../../watchedList/ChannelUsers";

@Service()
export class GetChannelSingleUseCase implements IUseCaseQueryCQRS<GetChannelSingleQueryDTO, Promise<GetChannelSingleResponse>> {
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository;
    @Inject('user.repository')
    private readonly _userRepository: UserRepository
    @Inject('channel_user.repository')
    private readonly _channelUserRepository: ChannelUserRepository

    async execute(param: GetChannelSingleQueryDTO): Promise<GetChannelSingleResponse> {
        const userAuthenticated = param.userAuthenticated

        if (!userAuthenticated)
            return left(new GetChannelSingleErrors.TokenInvalidError())

        try {
            const toUser = await this._userRepository.getById(param.toUserId)
            if (!toUser)
                return left(new GetChannelSingleErrors.ReceiverNotfoundError())

            const getChannel = await this._channelRepository.getExistedSingleChannel(param.toUserId, userAuthenticated.userId)

            if (!getChannel) {
                const channelOrError = Channel.create({
                    isPrivate: true,
                    isDirect: true,
                    lastMessageCreatedAt: new Date()
                })

                if(channelOrError.isFailure)
                    return left(Result.fail(channelOrError.error))
                
                const channel = channelOrError.getValue()
                const channelDb = ChannelMapper.toPersistence(channel)
                try {
                    const channelId = await this._channelRepository.create(channelDb)
                    if(!channelId)
                        return left(new GetChannelSingleErrors.DataCannotSave())

                    const userIds = [toUser.id.toString(), userAuthenticated.userId]
                    const channelUsers = userIds.map(userId => ChannelUser.create({
                        userId: UserId.create(new UniqueEntityId(userId as string)).getValue(),
                        channelId: ChannelId.create(new UniqueEntityId(channelId.toString())).getValue(),
                        isMute: false
                    }))

                    const ChannelUsersDb = channelUsers.map(channelUser => ChannelUserMapper.toPersistence(channelUser.getValue()))
                    try {
                        const channelUserIds = await this._channelUserRepository.createMultiple(ChannelUsersDb)
                        if(channelUserIds.length > 0) 
                            return right(Result.OK(channelId))
                    } catch (error) {
                        console.error(error)
                        return left(new ApplicationError.UnexpectedError(error))
                    }
                }
                catch (error) {
                    console.error(error)
                    return left(new ApplicationError.UnexpectedError(error))
                }
            }
            return right(Result.OK(getChannel.id.toString()))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
