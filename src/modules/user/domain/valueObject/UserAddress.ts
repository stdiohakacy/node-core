import { MessageError, ContentError } from './../../../../shared/exceptions/MessageError';
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

        if(validator.isEmpty(props.value)) {
            return Result.fail<UserAddress> (
                new MessageError(
                    ContentError.PARAM_REQUIRED(), 
                    'address'
                ).getMessage()
            )
        }
        if(!validator.minLength(props.value, this.minLength))
            return Result.fail<UserAddress>(
                new MessageError(
                    ContentError.PARAM_LEN_GREATER_OR_EQUAL(), 
                    'address', 
                    this.minLength)
                .getMessage()
            )
        if(!validator.maxLength(props.value, this.maxLength))
            return Result.fail<UserAddress>(
                new MessageError(
                    ContentError.PARAM_LEN_LESS_OR_EQUAL(), 
                    'address', 
                    this.maxLength
                ).getMessage())

        return Result.OK<UserAddress>(new UserAddress({value: props.value}))
    }
}
