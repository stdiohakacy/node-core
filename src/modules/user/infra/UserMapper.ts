import { UserEmail } from './../domain/valueObject/UserEmail';
import { UserDb } from './databases/typeorm/entities/UserDb';
import { User } from './../domain/aggregateRoot/User';
import { IMapper } from './../../../shared/IMapper';
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';
import { UserStatus } from '../domain/valueObject/UserStatus';
import { UserFirstName } from '../domain/valueObject/UserFirstName';
import { UserStatusType } from '../enums/UserStatusType';
import { UserActiveKey } from '../domain/valueObject/UserActiveKey';
import { UserActiveExpire } from '../domain/valueObject/UserActiveExpire';
import { UserForgotKey } from '../domain/valueObject/UserForgotKey';
import { UserForgotExpire } from '../domain/valueObject/UserForgotExpire';
import { UserPassword } from '../domain/valueObject/UserPassword';

export class UserMapper implements IMapper<User> {
    public static toDomain (userDb: UserDb): User | null {
        if(!userDb)
            return null
        const userOrError = User.create({
            firstName: UserFirstName.create({ value: userDb.firstName }).getValue(),
            email: UserEmail.create({ value: userDb.email }).getValue(),
            password: UserPassword.create({ value: userDb.password, hashed: true }).getValue(),
            status: UserStatus.create({ value: userDb.status }).getValue(),
            activeKey: userDb.activeKey ? UserActiveKey.create({ value: userDb.activeKey }).getValue() : null,
            activeExpire: userDb.activeExpire ?  UserActiveExpire.create({ value: userDb.activeExpire }).getValue() : null,
            forgotKey: userDb.forgotKey ? UserForgotKey.create({ value: userDb.forgotKey }).getValue() : null,
            forgotExpire: userDb.forgotExpire ? UserForgotExpire.create({value: userDb.forgotExpire}).getValue() : null
        }, new UniqueEntityId(userDb.id))

        if(userOrError.isFailure)
            console.error(userOrError.error)

        return userOrError.isSuccess ? userOrError.getValue() : null
    }

    public static async toPersistence (user: User): Promise<UserDb> {
        const userDb = new UserDb()
        let password: string = ''
        if(!!user.password === true) {
            if(user.password.isAlreadyHashed())
                password = user.password.value
            password = await user.password.getHashedValue()
        }

        userDb.status = UserStatusType.INACTIVE
        userDb.firstName = user.firstName && user.firstName.value
        userDb.lastName = user.lastName && user.lastName.value
        userDb.email = user.email && user.email.value
        userDb.password = password
        userDb.avatar = user.avatar && user.avatar.value
        userDb.gender = user.gender && user.gender.value
        userDb.birthday = user.birthday && user.birthday.value
        userDb.phone = user.phone && user.phone.value
        userDb.address = user.address && user.address.value
        userDb.culture = user.culture && user.culture.value
        userDb.currency = user.currency && user.currency.value
        userDb.activeKey = user.activeKey && user.activeKey.value
        userDb.activeExpire = user.activeExpire && user.activeExpire.value
        userDb.activedAt = user.activedAt && user.activedAt.value
        // userDb.archivedAt = user.archivedAt.value
        userDb.forgotKey = user.forgotKey && user.forgotKey.value
        userDb.forgotExpire = user.forgotExpire && user.forgotExpire.value

        return userDb
    }
}
