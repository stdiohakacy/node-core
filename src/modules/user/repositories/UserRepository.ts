import { UserMapper } from './../infra/UserMapper';
import { User } from './../domain/aggregateRoot/User';
import { IBaseRepository } from '../../../shared/repository/IBaseRepository';
import { UserEmail } from '../domain/valueObject/UserEmail';
import { UserDb } from './../infra/databases/typeorm/entities/UserDb';
import { Service } from 'typedi';
import { BaseRepository } from '../../../shared/repository/BaseRepository';
export interface IUserRepository extends IBaseRepository<UserDb, string> {
    getByEmail(userEmail: UserEmail): Promise<User>
    isEmailExist(userEmail: UserEmail): Promise<boolean>
}

@Service('user.repository')
export class UserRepository extends BaseRepository<UserDb, string> implements IUserRepository {
    constructor() {
        super(UserDb, {
            TABLE_NAME: 'user'
        })
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
