import { SystemError, MessageError } from './../../../../shared/exceptions/SystemError';
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
        if(validator.isEmpty(props.value) || !props.value)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'forgot expire')
        if(!validator.isDate(props.value))
            throw new SystemError(MessageError.DATA_INVALID)
            
        return Result.OK<UserForgotExpire>(new UserForgotExpire({value: props.value}))
    }
}
