import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';

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
            return Result.fail<UserActiveExpire>('The active expire is required')
        if(!validator.isDate(props.value))
            return Result.fail<UserActiveExpire>('The active expire is invalid')

        return Result.OK<UserActiveExpire>(
            new UserActiveExpire({value: props.value})
        )
    }
}
