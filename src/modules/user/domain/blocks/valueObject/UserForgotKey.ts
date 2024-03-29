import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

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
        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'forgot key')

        return Result.OK<UserForgotKey>(new UserForgotKey({value: props.value}))
    }
}
