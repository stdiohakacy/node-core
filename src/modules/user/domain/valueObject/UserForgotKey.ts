import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserForgotKeyProps {
    value: string
}

export class UserForgotKey extends ValueObject<IUserForgotKeyProps> {
    private constructor (props: IUserForgotKeyProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserForgotKeyProps): Result<UserForgotKey> {
        if(!validator.isEmpty(props.value) || !props.value) {
            return Result.fail<UserForgotKey>('Active key is null or undefined')
        }
        return Result.OK<UserForgotKey>(new UserForgotKey({value: props.value}))
    }
}
