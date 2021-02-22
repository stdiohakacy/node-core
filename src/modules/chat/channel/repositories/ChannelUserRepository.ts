import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { ChannelUserDb } from '../infra/databases/typeorm/entities/ChannelUserDb';

export interface IChannelUserRepository extends IBaseRepository<ChannelUserDb, string> {
    deleteChannel(channelId: string): Promise<boolean>
}

@Service('channel_user.repository')
export class ChannelUserRepository extends BaseRepository<ChannelUserDb, string> implements IChannelUserRepository {
    constructor() {
        super(ChannelUserDb, {
            TABLE_NAME: 'channel_user'
        })
    }
    
    async deleteChannel(channelId: string): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('channel_user')
            .delete()
            .where('channel_id = :channelId', { channelId })
            .execute()
        
        return !!result.affected
    }
}
