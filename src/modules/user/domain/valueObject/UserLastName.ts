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
            return Result.fail<UserLastName>('The last name is required')
        if(
            !validator.minLength(props.value, this.minLength) || 
            !validator.maxLength(props.value, this.maxLength)
        )
            return Result.fail<UserLastName>(`The length of last name must be between ${this.minLength} and ${this.maxLength}!`)
    
        const userFirstName = new UserLastName(props)
        return Result.OK<UserLastName>(userFirstName);
    }
}
