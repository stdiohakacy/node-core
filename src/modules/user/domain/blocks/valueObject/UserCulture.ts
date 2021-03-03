import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

export interface IUserCultureProps {
    value: string
}

export class UserCulture extends ValueObject<IUserCultureProps> {
    public static maxLength: number = 5;

    private constructor (props: IUserCultureProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserCultureProps): Result<UserCulture> {
        props.value = props.value.trim()

        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'culture')
        if(props.value.length !== this.maxLength)
            throw new SystemError(MessageError.PARAM_LEN_EQUAL, this.maxLength)

        return Result.OK<UserCulture>(new UserCulture({value: props.value}))
    }
}
