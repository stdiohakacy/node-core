import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

export interface IUserAvatarProps {
    value: string
}

export class UserAvatar extends ValueObject<IUserAvatarProps> {
    public static minLength: number = 10;
    public static maxLength: number = 200;

    private constructor (props: IUserAvatarProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IUserAvatarProps): Result<UserAvatar> {
        props.value = props.value.trim()

        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'avatar')
        if(!validator.minLength(props.value, this.minLength))
            throw new SystemError(MessageError.PARAM_LEN_BETWEEN, 'avatar', this.minLength, this.maxLength)

        return Result.OK<UserAvatar>(new UserAvatar({value: props.value}))
    }
}
