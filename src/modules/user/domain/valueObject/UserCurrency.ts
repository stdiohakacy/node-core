import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

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

        if(!validator.isEmpty(props.value)) {
            return Result.fail<UserCurrency>('Currency is null or undefined')
        }
        if(props.value.length !== this.maxLength)
          return Result.fail<UserCurrency>(`Currency length invalid`)

        return Result.OK<UserCurrency>(new UserCurrency({value: props.value}))
    }
}
