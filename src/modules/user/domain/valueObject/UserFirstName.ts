import { SystemError, MessageError } from './../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserFirstName {
    value: string
}

export class UserFirstName extends ValueObject<IUserFirstName> {
    public static maxLength: number = 20;
    public static minLength: number = 5;
    
    private constructor (props: IUserFirstName) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }
    
    public static create (props: IUserFirstName): Result<UserFirstName> {
        if(validator.isEmpty(props.value))
            return Result.fail<UserFirstName>('The first name is required')
        if(
            !validator.minLength(props.value, this.minLength) || 
            !validator.maxLength(props.value, this.maxLength)
        )
            return Result.fail<UserFirstName>(`The length of first name must be between ${this.minLength} and ${this.maxLength}!`)
    
        const userFirstName = new UserFirstName(props)
        return Result.OK<UserFirstName>(userFirstName);
    }
}
