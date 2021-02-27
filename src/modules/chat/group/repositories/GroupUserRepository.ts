import { GroupUserDb } from './../../infra/databases/typeorm/entities/GroupUserDb';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';

export interface IGroupUserRepository extends IBaseRepository<GroupUserDb, string> { }

@Service('group_user.repository')
export class GroupUserRepository extends BaseRepository<GroupUserDb, string> implements IGroupUserRepository {
    constructor() {
        super(GroupUserDb, {
            TABLE_NAME: 'group_user'
        })
    }
}
