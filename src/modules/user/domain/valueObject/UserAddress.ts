import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserAddressProps {
    value: string
}

export class UserAddress extends ValueObject<IUserAddressProps> {
    public static maxLength: number = 200;
    public static minLength: number = 10;

    private constructor (props: IUserAddressProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserAddressProps): Result<UserAddress> {
        props.value = props.value.trim()

        if(!validator.isEmpty(props.value)) {
            return Result.fail<UserAddress>('Address is null or undefined')
        }
        if(!validator.minLength(props.value, this.minLength))
          return Result.fail<UserAddress>(`Address min length invalid`)
        if(!validator.maxLength(props.value, this.maxLength))
          return Result.fail<UserAddress>(`Address max length invalid`)

        return Result.OK<UserAddress>(new UserAddress({value: props.value}))
    }
}
