import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { GroupMessageDb } from '../../infra/databases/typeorm/entities/GroupMessageDb';

export interface IGroupMessageRepository extends IBaseRepository<GroupMessageDb, string> { }

@Service('group_message.repository')
export class GroupMessageRepository extends BaseRepository<GroupMessageDb, string> implements IGroupMessageRepository {
    constructor() {
        super(GroupMessageDb, {
            TABLE_NAME: 'group_message'
        })
    }
}
