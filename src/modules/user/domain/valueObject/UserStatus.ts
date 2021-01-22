import { UserStatusType } from '../../enums/UserStatusType';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserStatusProps {
    value: UserStatusType
}

export class UserStatus extends ValueObject<IUserStatusProps> {
    private constructor (props: IUserStatusProps) {
        super(props);
    }

    get value(): UserStatusType {
        return this.props.value
    }

    public static create(props: IUserStatusProps): Result<UserStatus> {
        if(props.value && !validator.isEnum(props.value, UserStatus)) {
            return Result.fail<UserStatus>()
        }

        return Result.OK<UserStatus>(new UserStatus({ value: props.value }))
    }
}