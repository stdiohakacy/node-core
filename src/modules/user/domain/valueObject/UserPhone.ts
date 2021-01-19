import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserPhoneProps {
    value: string
}

export class UserPhone extends ValueObject<IUserPhoneProps> {
    public static maxLength: number = 20;
    public static minLength: number = 10;

    private constructor (props: IUserPhoneProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserPhoneProps): Result<UserPhone> {
        props.value = props.value.trim()
        
        if(!validator.minLength(props.value, this.minLength))
          return Result.fail<UserPhone>(`The email min length invalid`)
        if(!validator.maxLength(props.value, this.maxLength))
          return Result.fail<UserPhone>(`The email max length invalid`)

        return Result.OK<UserPhone>(new UserPhone({value: props.value}))
    }
}
