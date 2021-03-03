import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

export interface IUserActivedAtProps {
    value: Date
}

export class UserActivedAt extends ValueObject<IUserActivedAtProps> {
    private constructor (props: IUserActivedAtProps) {
        super(props);
    }

    get value(): Date {
        return this.props.value
    }

    public static create(props: IUserActivedAtProps): Result<UserActivedAt> {
        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'actived at')

        if(!validator.isDate(props.value))
            throw new SystemError(MessageError.DATA_INVALID)
        
        return Result.OK<UserActivedAt>(
            new UserActivedAt({ value: props.value })
        )
    }
}
