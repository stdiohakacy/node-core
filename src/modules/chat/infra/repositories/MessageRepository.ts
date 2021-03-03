import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { MessageDb } from '../databases/typeorm/entities/MessageDb';

export interface IMessageRepository extends IBaseRepository<MessageDb, string> {
    getMessageNotOwned(channelId: string, fromUserId: string): Promise<MessageDb>
}

@Service('message.repository')
export class MessageRepository extends BaseRepository<MessageDb, string> implements IMessageRepository {
    constructor() {
        super(MessageDb, {
            TABLE_NAME: 'message'
        })
    }

    async getMessageNotOwned(channelId: string, fromUserId: string): Promise<MessageDb> {
        return await this.repository
            .createQueryBuilder('message')
            .where('message.channelId = :channelId', { channelId })
            .andWhere('message.userId != :userId', { userId: fromUserId })
            .orderBy('message.createdAt', 'DESC')
            .select('id')
            .addSelect('message.createdAt')
            .getOne()
    }
}
