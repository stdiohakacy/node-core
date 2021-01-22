import { UserEmail } from './../domain/valueObject/UserEmail';
import { UserDb } from './databases/typeorm/entities/UserDb';
import { User } from './../domain/aggregateRoot/User';
import { IMapper } from './../../../shared/IMapper';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { UserStatus } from '../domain/valueObject/UserStatus';
import { UserFirstName } from '../domain/valueObject/UserFirstName';
import { UserPassword } from '../domain/valueObject/UserPassword';
import { UserStatusType } from '../enums/UserStatusType';

export class UserMapper implements IMapper<User> {
    public static toDomain (userDb: UserDb): User | null {
        const userStatusOrError = UserStatus.create({ value: userDb.status })
        const userFirstNameOrError = UserFirstName.create({ value: userDb.firstName })
        const userEmailOrError = UserEmail.create({value: userDb.email })
        const userPassword = UserPassword.create({ value: userDb.password })

        const userOrError = User.create({
            firstName: userFirstNameOrError.getValue(),
            email: userEmailOrError.getValue(),
            password: userPassword.getValue(),
            status: userStatusOrError.getValue()
        }, new UniqueEntityId(userDb.id))
        
        if(userOrError.isFailure)
            console.log(userOrError.error)

        return userOrError.isSuccess ? userOrError.getValue() : null
    }

    public static toPersistence (user: User): UserDb {
        const userDb = new UserDb()

        userDb.status = UserStatusType.ACTIVED
        userDb.firstName = user.firstName.value
        userDb.lastName = user.lastName.value
        userDb.email = user.email.value
        userDb.password = user.password.value
        userDb.avatar = user.avatar.value
        userDb.gender = user.gender.value
        userDb.birthday = user.birthday.value
        userDb.phone = user.phone.value
        userDb.address = user.address.value
        userDb.culture = user.culture.value
        userDb.currency = user.currency.value
        userDb.activeKey = user.activeKey.value
        userDb.activeExpire = user.activeExpire.value
        userDb.activedAt = user.activedAt.value
        // userDb.archivedAt = user.archivedAt.value
        userDb.forgotKey = user.forgotKey.value
        userDb.forgotExpire = user.forgotExpire.value

        return userDb
    }
}
