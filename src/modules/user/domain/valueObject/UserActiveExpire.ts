import { SystemError, MessageError } from './../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserActiveExpireProps {
    value: Date
}
export class UserActiveExpire extends ValueObject<IUserActiveExpireProps> {
    private constructor (props: IUserActiveExpireProps) {
        super(props);
    }

    get value(): Date {
        return this.props.value
    }

    public static create(props: IUserActiveExpireProps): Result<UserActiveExpire> {
        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'active expired')
        if(!validator.isDate(props.value))
            throw new SystemError(MessageError.DATA_INVALID)

        return Result.OK<UserActiveExpire>(
            new UserActiveExpire({value: props.value})
        )
    }
}
