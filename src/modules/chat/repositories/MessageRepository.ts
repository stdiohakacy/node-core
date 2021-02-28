import { ChannelDb } from './../infra/databases/typeorm/entities/ChannelDb';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../shared/repository/BaseRepository';
import { MessageDb } from '../infra/databases/typeorm/entities/MessageDb';
import { UserAuthenticated } from '../../auth/useCases/command/authenticate/AuthenticateResponse';

export interface IMessageRepository extends IBaseRepository<MessageDb, string> {
    getLastMessage(channel: ChannelDb, userAuthenticated: UserAuthenticated): Promise<MessageDb>
}

@Service('message.repository')
export class MessageRepository extends BaseRepository<MessageDb, string> implements IMessageRepository {
    constructor() {
        super(MessageDb, {
            TABLE_NAME: 'message'
        })
    }

    async getLastMessage(channel: ChannelDb, userAuthenticated: UserAuthenticated): Promise<MessageDb> {
        return new MessageDb()
    }
}
