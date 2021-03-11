import { UserMapper } from '../UserMapper';
import { User } from '../../domain/blocks/aggregateRoot/User';
import { Service } from 'typedi';
import { BaseRepository, IBaseRepository } from '../../../../shared/repository/BaseRepository';
import { UserEmail } from '../../domain/blocks/valueObject/UserEmail';
import { UserDb } from '../../../../infra/UserDb';

export interface IUserRepository extends IBaseRepository<UserDb, string> {
    getByEmail(userEmail: UserEmail): Promise<User>
    isEmailExist(userEmail: UserEmail): Promise<boolean>
    isExist(id: string): Promise<boolean>
}

@Service('user.repository')
export class UserRepository extends BaseRepository<UserDb, string> implements IUserRepository {
    constructor() {
        super(UserDb, {
            TABLE_NAME: 'user'
        })
    }
    
    async isExist(id: string): Promise<boolean> {
        return await this.repository.count({ id }) > 0
    }

    async getByEmail(userEmail: UserEmail): Promise<User> {
        const result = await this.repository
            .createQueryBuilder('user')
            .where(`LOWER(user.email) = LOWER(:email)`, { email: userEmail.value })
            .getOne();

        return UserMapper.toDomain(result)
    }

    async isEmailExist(userEmail: UserEmail): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder('user')
            .select(`user.id`)
            .where(`LOWER(user.email) = LOWER(:email)`, { email: userEmail.value })
            .getOne();
        return !!result;
    }
}
