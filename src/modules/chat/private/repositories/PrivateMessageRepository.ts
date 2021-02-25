import { PrivateMessageDb } from './../../infra/databases/typeorm/entities/PrivateMessageDb';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';

export interface IPrivateMessageRepository extends IBaseRepository<PrivateMessageDb, string> { }

@Service('private_message.repository')
export class PrivateMessageRepository
    extends BaseRepository<PrivateMessageDb, string>
    implements IPrivateMessageRepository {

    constructor() {
        super(PrivateMessageDb, {
            TABLE_NAME: 'private_message'
        })
    }
}
