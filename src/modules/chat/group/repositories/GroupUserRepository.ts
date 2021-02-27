import { GroupUserDb } from './../../infra/databases/typeorm/entities/GroupUserDb';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';

export interface IGroupUserRepository extends IBaseRepository<GroupUserDb, string> {
    isIntoGroup(userId: string, toGroupId: string): Promise<boolean>
}

@Service('group_user.repository')
export class GroupUserRepository extends BaseRepository<GroupUserDb, string> implements IGroupUserRepository {
    constructor() {
        super(GroupUserDb, {
            TABLE_NAME: 'group_user'
        })
    }
    async isIntoGroup(userId: string, toGroupId: string): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('group_user')
            .where('group_user.userId = :userId', { userId })
            .andWhere('group_user.toGroupId = :toGroupId', { toGroupId })
            .getCount()

        return result > 0
    }
}
