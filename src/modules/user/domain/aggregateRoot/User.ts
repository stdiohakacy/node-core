import { UserCreated } from './../events/UserCreated';
import { UserLoggedIn } from './../events/UserLoggedIn';
import { JWTToken, RefreshToken } from '../../../../shared/services/auth/TokenAlias';
import { Guard } from './../../../../shared/core/Guard';
import { UserId } from "../entity/UserId";
import { UserActivedAt } from "../valueObject/UserActivedAt";
import { UserActiveExpire } from "../valueObject/UserActiveExpire";
import { UserActiveKey } from "../valueObject/UserActiveKey";
import { UserAddress } from "../valueObject/UserAddress";
import { UserAvatar } from "../valueObject/UserAvatar";
import { UserBirthday } from "../valueObject/UserBirthday";
import { UserCulture } from "../valueObject/UserCulture";
import { UserCurrency } from "../valueObject/UserCurrency";
import { UserEmail } from "../valueObject/UserEmail";
import { UserFirstName } from "../valueObject/UserFirstName";
import { UserForgotExpire } from "../valueObject/UserForgotExpire";
import { UserForgotKey } from "../valueObject/UserForgotKey";
import { UserGender } from "../valueObject/UserGender";
import { UserLastName } from "../valueObject/UserLastName";
import { UserPassword } from "../valueObject/UserPassword";
import { UserPhone } from "../valueObject/UserPhone";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { UserStatus } from '../valueObject/UserStatus';

interface IUserProps {
    status?: UserStatus,
    firstName: UserFirstName,
    lastName?: UserLastName,
    email: UserEmail,
    password?: UserPassword,
    avatar?: UserAvatar,
    gender?: UserGender,
    birthday?: UserBirthday,
    phone?: UserPhone,
    address?: UserAddress,
    culture?: UserCulture,
    currency?: UserCurrency,
    activeKey?: UserActiveKey,
    activeExpire?: UserActiveExpire,
    activedAt?: UserActivedAt,
    forgotKey?: UserForgotKey,
    forgotExpire?: UserForgotExpire
    accessToken?: JWTToken
    refreshToken?: RefreshToken
}

export class User extends AggregateRoot<IUserProps> {
    private constructor(props: IUserProps, id?: UniqueEntityId) {
        super(props, id)
    }

    get userId(): UserId {
        return UserId.create(this._id).getValue()
    }

    get status(): UserStatus {
        return this.props.status
    }

    get firstName(): UserFirstName {
        return this.props.firstName
    }

    get lastName(): UserLastName {
        return this.props.lastName
    }

    get email(): UserEmail {
        return this.props.email
    }
    
    get password(): UserPassword {
        return this.props.password
    }

    get avatar(): UserAvatar {
        return this.props.avatar
    }

    get gender(): UserGender {
        return this.props.gender
    }

    get birthday(): UserBirthday {
        return this.props.birthday
    }

    get phone(): UserPhone {
        return this.props.phone
    }

    get address(): UserAddress {
        return this.props.address
    }

    get culture(): UserCulture {
        return this.props.culture
    }

    get currency(): UserCurrency {
        return this.props.currency
    }

    get activeKey(): UserActiveKey {
        return this.props.activeKey
    }

    get activeExpire(): UserActiveExpire {
        return this.props.activeExpire
    }

    get activedAt(): UserActivedAt {
        return this.props.activedAt
    }

    get forgotKey(): UserForgotKey {
        return this.props.forgotKey
    }

    get forgotExpire(): UserForgotExpire {
        return this.props.forgotExpire
    }

    get accessToken(): JWTToken {
        return this.props.accessToken
    }

    get refreshToken(): RefreshToken {
        return this.props.refreshToken
    }

    public static create(props: IUserProps, id?: UniqueEntityId): Result<User> {
        const guard = Guard.againstNullOrUndefinedBulk([
            { argument: props.firstName, argumentName: 'firstName' },
            { argument: props.email, argumentName: 'email' },
            // { argument: props.password, argumentName: 'password' },
        ])

        if(!guard.succeeded)
            return Result.fail<User>(guard.message)
        
        const isNewUser = !!id === false;

        const user = new User({...props}, id)
        if(isNewUser)
            user.addDomainEvent(new UserCreated(user))
        return Result.OK<User>(user)
    }

    public setToken(accessToken: JWTToken, refreshToken: RefreshToken): void {
        this.props.accessToken = accessToken
        this.props.refreshToken = refreshToken
        this.addDomainEvent(new UserLoggedIn(this))
    }

    public isLogin(): boolean {
        return !!this.props.accessToken && !!this.props.refreshToken
    }
}
