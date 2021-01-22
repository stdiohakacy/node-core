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

    public static async toPersistence (user: User): Promise<UserDb> {
        const userDb = new UserDb()
        let password: string = ''
        if(!!user.password === true) {
            if(user.password.isAlreadyHashed())
                password = user.password.value
            password = await user.password.getHashedValue()
        } 

        userDb.status = UserStatusType.INACTIVE
        userDb.firstName = user.firstName.value
        userDb.lastName = user.lastName.value || ''
        userDb.email = user.email.value
        userDb.password = password
        userDb.avatar = user.avatar && user.avatar.value || ''
        userDb.gender = user.gender && user.gender.value || null
        userDb.birthday = user.birthday && user.birthday.value || null
        userDb.phone = user.phone && user.phone.value || ''
        userDb.address = user.address && user.address.value || ''
        userDb.culture = user.culture && user.culture.value || ''
        userDb.currency = user.currency && user.currency.value || ''
        userDb.activeKey = user.activeKey && user.activeKey.value || ''
        userDb.activeExpire = user.activeExpire && user.activeExpire.value || null
        userDb.activedAt = user.activedAt && user.activedAt.value || null
        // userDb.archivedAt = user.archivedAt.value
        userDb.forgotKey = user.forgotKey && user.forgotKey.value || ''
        userDb.forgotExpire = user.forgotExpire && user.forgotExpire.value || null

        return userDb
    }
}
