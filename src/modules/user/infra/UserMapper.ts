import { UserEmail } from './../domain/valueObject/UserEmail';
import { UserDb } from './databases/typeorm/entities/UserDb';
import { User } from './../domain/aggregateRoot/User';
import { IMapper } from './../../../shared/IMapper';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { UserStatus } from '../domain/valueObject/UserStatus';
import { UserFirstName } from '../domain/valueObject/UserFirstName';
import { UserPassword } from '../domain/valueObject/UserPassword';

export class UserMapper implements IMapper<User> {
    public static toDomain (userDb: UserDb): User | null {
        const userStatusOrError = UserStatus.create({ value: userDb.status })
        const userFirstNameOrError = UserFirstName.create({ value: userDb.firstName })
        const userEmailOrError = UserEmail.create({value: userDb.email })
        const userPassword = UserPassword.create({ value: userDb.password })

        const userOrError = User.create({
            status: userStatusOrError.getValue(),
            firstName: userFirstNameOrError.getValue(),
            email: userEmailOrError.getValue(),
            password: userPassword.getValue()
        }, new UniqueEntityId(userDb.id))
        
        if(userOrError.isFailure)
            console.log(userOrError.error)

        return userOrError.isSuccess ? userOrError.getValue() : null
    }

    public static toPersistence (user: User): UserDb {
        const userDb = new UserDb()

        userDb.firstName = user.firstName
        userDb.updatedAt = new Date()

        return userDb
    }
}
