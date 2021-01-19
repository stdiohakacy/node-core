import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserForgotExpireProps {
    value: Date
}

export class UserForgotExpire extends ValueObject<IUserForgotExpireProps> {
    private constructor (props: IUserForgotExpireProps) {
        super(props);
    }

    get value(): Date {
        return this.props.value
    }

    public static create(props: IUserForgotExpireProps): Result<UserForgotExpire> {
        if(!validator.isEmpty(props.value) || !props.value) {
            return Result.fail<UserForgotExpire>('Forgot expire is null or undefined')
        }
        if(!validator.isDate(props.value)) {
            return Result.fail<UserForgotExpire>('Forgot expire invalid date')
        }
        return Result.OK<UserForgotExpire>(new UserForgotExpire({value: props.value}))
    }
}
