import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

export interface IUserCurrencyProps {
    value: string
}

export class UserCurrency extends ValueObject<IUserCurrencyProps> {
    public static maxLength: number = 3;

    private constructor (props: IUserCurrencyProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserCurrencyProps): Result<UserCurrency> {
        props.value = props.value.trim()

        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'currency')
        if(props.value.length !== this.maxLength)
            throw new SystemError(MessageError.PARAM_LEN_EQUAL, 'currency')

        return Result.OK<UserCurrency>(new UserCurrency({value: props.value}))
    }
}
