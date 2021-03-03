import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

export interface IUserBirthdayProps {
    value: Date
}

export class UserBirthday extends ValueObject<IUserBirthdayProps> {
    private constructor (props: IUserBirthdayProps) {
        super(props);
    }

    get value(): Date {
        return this.props.value
    }

    public static create(props: IUserBirthdayProps): Result<UserBirthday> {
        if(!validator.isDate(props.value))
            throw new SystemError(MessageError.DATA_INVALID)
        if(this.invalidBirthday(props.value))
            throw new SystemError(MessageError.PARAM_INVALID, 'birthday')
        
        return Result.OK<UserBirthday>(new UserBirthday({ value: props.value }))
    }

    public birthdayDisplay(): string {
        return this.value && `${this.value.getFullYear()}-${this.value.getMonth() + 1}-${this.value.getDate()}`;

    }

    private static invalidBirthday(val: Date): boolean {
        val = new Date(val.getFullYear(), val.getMonth(), val.getDate());
        const now = new Date();

        return (val.getTime() > new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() || now.getFullYear() - val.getFullYear() > 100)
    }
}
