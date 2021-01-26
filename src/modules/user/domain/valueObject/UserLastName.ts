import { SystemError, MessageError } from './../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserLastName {
    value: string
}
export class UserLastName extends ValueObject<IUserLastName> {
    public static maxLength: number = 20;
    public static minLength: number = 5;
    
    private constructor (props: IUserLastName) {
        super(props);
    }

    get value (): string {
        return this.props.value;
    }
    
    public static create (props: IUserLastName): Result<UserLastName> {
        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'last name')
        if(!validator.minLength(props.value, this.minLength))
            throw new SystemError(MessageError.PARAM_LEN_BETWEEN, 'last name', this.minLength, this.maxLength)

        const userLastName = new UserLastName(props)
        return Result.OK<UserLastName>(userLastName);
    }
}
