import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { GroupDb } from '../../infra/databases/typeorm/entities/GroupDb';

export interface IGroupRepository extends IBaseRepository<GroupDb, string> {}

@Service('group.repository')
export class GroupRepository extends BaseRepository<GroupDb, string> implements IGroupRepository {
    constructor() {
        super(GroupDb, {
            TABLE_NAME: 'group'
        })
    }
}
