import { Inject, Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../shared/repository/BaseRepository';
import { ChannelDb } from '../infra/databases/typeorm/entities/ChannelDb';
import { ChannelUserRepository } from './ChannelUserRepository';

export interface IChannelRepository extends IBaseRepository<ChannelDb, string> {
    getChannelById(id: string, fromUserId: string): Promise<ChannelDb>
    isChannelExist(id: string): Promise<boolean>
    getChannelsByUser(fromUserId: string, filter?: any): Promise<[ChannelDb[], number]>
}

@Service('channel.repository')
export class ChannelRepository extends BaseRepository<ChannelDb, string> implements IChannelRepository {
    constructor() {
        super(ChannelDb, {
            TABLE_NAME: 'channel'
        })
    }

    async getChannelById(id: string, fromUserId: string): Promise<ChannelDb> {
        const result = await this.repository
            .createQueryBuilder('channel')
            .where('channel.id = :id', { id })

        if (fromUserId)
            result
                .leftJoinAndSelect('channel.channelUsers', 'channelUsers')
                .andWhere('channelUsers.userId = :userId', { userId: fromUserId })
        return result.getOne()
    }

    async isChannelExist(id: string): Promise<boolean> {
        const count = await this.repository
            .createQueryBuilder('channel')
            .where('id = :id', { id })
            .getCount()
        return count > 0
    }

    async getChannelsByUser(fromUserId: string, filter?: any): Promise<[ChannelDb[], number]> {
        const result = await this.repository
        .createQueryBuilder('channel')
        .leftJoinAndSelect('channel.channelUsers', 'channelUsers')
        .where('channelUsers.userId = :userId', { userId: fromUserId });
        return await result.getManyAndCount()
    }

    async getExistedSingleChannel(firstUserId: string, secondUserId: string) {
        const query = await this.repository
            .createQueryBuilder('channel')
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
