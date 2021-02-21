import { Service } from 'typedi';
import { BaseRepository } from '../../../../shared/repository/BaseRepository';
import { IBaseRepository } from '../../../../shared/repository/IBaseRepository';
import { UserAuthenticated } from '../../../auth/useCases/command/authenticate/AuthenticateResponse';
import { Channel } from '../domain/aggregateRoot/Channel';
import { ChannelMapper } from '../infra/ChannelMapper';
import { ChannelDb } from "../infra/databases/typeorm/entities/ChannelDb";
export interface IChannelRepository extends IBaseRepository<ChannelDb, string> {
    isChannelExist(id: string): Promise<boolean>
    getChannelById(id: string, user?: UserAuthenticated): Promise<Channel>
    getExistedSingleChannel(firstUserId: string, secondUserId: string): Promise<any>
}
@Service('channel.repository')
export class ChannelRepository extends BaseRepository<ChannelDb, string> implements IChannelRepository {
    constructor() {
        super(ChannelDb, {
            TABLE_NAME: 'channel'
        })
    }

    async isChannelExist(id: string): Promise<boolean> {
        return await this.repository.count({ id }) > 0
    }

    async getChannelById(id: string, user?: UserAuthenticated): Promise<Channel> {
        const query = await this.repository
            .createQueryBuilder('channel')
            .andWhere('channel.id = :id', { id })

        if (user) {
            query
                .leftJoinAndSelect('channel.channelUsers', 'channelUsers')
                .andWhere('channelUsers.userId = :userId', { userId: user.userId })
        }

        const channel = await query.getOne()
        return ChannelMapper.toDomain(channel)
    }

    async getExistedSingleChannel(firstUserId: string, secondUserId: string): Promise<Channel> {
        const query = await this.repository
            .createQueryBuilder('channel')
            .andWhere('channel.isDirect = TRUE')
            .leftJoinAndMapMany(
                'channel.channelUsers',
                'channel_user',
                'channelUser',
                `channelUser.channelId = channel.id
                AND channelUser.userId IN (:...userIds)`,
                { userIds: [firstUserId, secondUserId] }
            )
            .select('channel.id', 'id')
            .addSelect('channel.name', 'name')
            .addSelect('channel.description', 'description')
            .addSelect('channel.isDirect', 'isDirect')
            .addSelect('channel.lastSeen', 'lastSeen')
            .addSelect('channel.lastMessageId', 'lastMessageId')
            .addSelect('channel.lastMessageCreatedAt', 'lastMessageCreatedAt')
            .groupBy('channel.id')
            .having('COUNT(DISTINCT(channelUser.id)) = 2');

        return await query.getRawMany().then(results => results[0])
    }
}
