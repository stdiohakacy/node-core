import { Service } from "typedi";
import { BaseRepository } from "../../../shared/repository/BaseRepository";
import { IBaseRepository } from "../../../shared/repository/IBaseRepository";
import { User } from "../../user/domain/aggregateRoot/User";
import { UserEmail } from "../../user/domain/valueObject/UserEmail";
import { UserPassword } from "../../user/domain/valueObject/UserPassword";
import { UserDb } from "../../user/infra/databases/typeorm/entities/UserDb";
import { UserMapper } from "../../user/infra/UserMapper";

export interface IAuthRepository extends IBaseRepository<UserDb, string> {
    getByEmailPassword(userEmail: UserEmail, userPassword: UserPassword): Promise<User>
}

@Service('auth.repository')
export class AuthRepository extends BaseRepository<UserDb, string> implements IAuthRepository {
    constructor() {
        super(UserDb, {
            TABLE_NAME: 'user'
        })
    }

    async getByEmailPassword(userEmail: UserEmail, userPassword: UserPassword): Promise<User> {
        const result = await this.repository
            .createQueryBuilder('user')
            .where(`LOWER(user.email) = LOWER(:email)`, { email: userEmail.value })
            .andWhere(`user.password = :password`, { password: userPassword.comparePassword(userPassword.value) })
            .getOne();
        
        return UserMapper.toDomain(result)
    }
}
