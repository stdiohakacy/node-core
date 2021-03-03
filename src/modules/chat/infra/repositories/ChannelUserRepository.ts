import { ChannelUserDb } from '../databases/typeorm/entities/ChannelUserDb';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { UserAuthenticated } from '../../../auth/domain/useCases/response/AuthenticateResponse';
import { ChannelDb } from '../databases/typeorm/entities/ChannelDb';

export interface IChannelUserRepository extends IBaseRepository<ChannelUserDb, string> {
    getDisplayNameChannel(channel: ChannelDb, userAuthenticated: UserAuthenticated): Promise<string>
    deleteByChannelId(channelId: string): Promise<boolean>
}

@Service('channel_user.repository')
export class ChannelUserRepository extends BaseRepository<ChannelUserDb, string> implements IChannelUserRepository {
    constructor() {
        super(ChannelUserDb, {
            TABLE_NAME: 'channel_user'
        })
    }
    
    async getDisplayNameChannel(channel: ChannelDb, userAuthenticated: UserAuthenticated): Promise<string> {
        let channelName = channel.name
        if (!channelName) {
            const result = await this.repository
                .createQueryBuilder('channel_user')
                .leftJoinAndMapOne('channelUser.user', 'user', 'user', 'user.id = channelUser.userId')
                .andWhere('channelUser.channelId = :channelId', { channelId: channel.id })
                .andWhere('channelUser.userId != :userId', { userId: userAuthenticated.userId })
                .addSelect('user.id', 'id')
                .addSelect('user.firstName', 'firstName')
                .addSelect('user.lastName', 'lastName')
                .addSelect(`CONCAT(CONCAT(user.firstName, ' '), user.lastName)`, 'fullName');

            const [total, users] = await Promise.all([
                channel.isDirect ? Promise.resolve(0) : result.getCount(),
                result.limit(4).getRawMany()
            ])

            if (channel.isDirect)
                channelName = users[0]?.fullName
            else {
                channelName = users[0].firstName
                for (const user of users.slice(0, 3)) {
                    channelName += `, ${user?.firstName} `
                }
                if (total > 4) {
                    channelName += ` and ${total - 4} ${(total - 4) === 1
                        ? 'other'
                        : 'others'}`
                }
            }
            return channelName
        }
    }

    async deleteByChannelId(channelId: string): Promise<boolean> {
        const result = await this.repository
        .createQueryBuilder('channel_user')
        .where('channelId = :channelId', { channelId })
        .delete()
        .execute()

        return !!result
    }
}
