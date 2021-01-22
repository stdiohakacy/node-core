import { MessageError, ContentError } from './../../../../shared/exceptions/MessageError';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

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
            return Result.fail<UserBirthday>(new MessageError(ContentError.DATA_INVALID()).getMessage())
        if(this.invalidBirthday(props.value))
            return Result.fail<UserBirthday>(`Birthday must be past from now`)
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
