import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

export interface IUserPhoneProps {
    value: string
}

export class UserPhone extends ValueObject<IUserPhoneProps> {
    public static maxLength: number = 20;
    public static minLength: number = 10;

    private constructor (props: IUserPhoneProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserPhoneProps): Result<UserPhone> {
        props.value = props.value.trim()

        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'phone')
        if(!validator.minLength(props.value, this.minLength))
            throw new SystemError(MessageError.PARAM_LEN_BETWEEN, 'phone', this.minLength, this.maxLength)

        return Result.OK<UserPhone>(new UserPhone({value: props.value}))
    }
}
