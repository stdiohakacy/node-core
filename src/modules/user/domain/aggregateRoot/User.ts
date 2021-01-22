import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { UserStatus } from "../../enums/UserStatusType";
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
import * as validator from 'class-validator'
import { ContentError, MessageError } from "../../../../shared/exceptions/MessageError";

interface IUserProps {
    status: UserStatus,
    firstName: UserFirstName,
    lastName?: UserLastName,
    email: UserEmail,
    password: UserPassword,
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

    public static create(props: IUserProps, id?: UniqueEntityId): Result<User> {
        if(validator.isEmpty(props.status) || !props.status)
            return Result.fail<User>(new MessageError(ContentError.PARAM_REQUIRED(), 'status').getMessage())

        if(validator.isEmpty(props.firstName) || !props.firstName)
            return Result.fail<User>(new MessageError(ContentError.PARAM_REQUIRED(), 'first name').getMessage())

        if(validator.isEmpty(props.email) || !props.email)
            return Result.fail<User>(new MessageError(ContentError.PARAM_REQUIRED(), 'email').getMessage())

        if(validator.isEmpty(props.password) || !props.password)
            return Result.fail<User>(new MessageError(ContentError.PARAM_REQUIRED(), 'password').getMessage())
            
        const user = new User({...props}, id)
        return Result.OK<User>(user)
    }

    
}
