import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { MessageDb } from '../infra/databases/typeorm/entities/MessageDb';

export interface IMessageRepository extends IBaseRepository<MessageDb, string> {}

@Service('message.repository')
export class MessageRepository extends BaseRepository<MessageDb, string> implements IMessageRepository {
    constructor() {
        super(MessageDb, {
            TABLE_NAME: 'message'
        })
    }
}
