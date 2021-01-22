import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

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
        if(!validator.isEmpty(props.value) || !props.value) {
            return Result.fail<UserActivedAt>('Active expire is null or undefined')
        }
        if(!validator.isDate(props.value)) {
            return Result.fail<UserActivedAt>('Active expire invalid date')
        }
        return Result.OK<UserActivedAt>(new UserActivedAt({value: props.value}))
    }
}
