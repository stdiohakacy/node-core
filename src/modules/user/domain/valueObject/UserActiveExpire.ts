import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserActiveExpireProps {
    value: string
}

export class UserActiveExpire extends ValueObject<IUserActiveExpireProps> {
    private constructor (props: IUserActiveExpireProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserActiveExpireProps): Result<UserActiveExpire> {
        if(!validator.isEmpty(props.value) || !props.value) {
            return Result.fail<UserActiveExpire>('Active expire is null or undefined')
        }
        if(!validator.isDate(props.value)) {
            return Result.fail<UserActiveExpire>('Active expire invalid date')
        }
        return Result.OK<UserActiveExpire>(new UserActiveExpire({value: props.value}))
    }
}
