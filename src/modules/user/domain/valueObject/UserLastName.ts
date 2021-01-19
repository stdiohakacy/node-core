import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserLastName {
    lastName: string
}

export class UserLastName extends ValueObject<IUserLastName> {
    public static maxLength: number = 20;
    public static minLength: number = 5;
    
    private constructor (props: IUserLastName) {
        super(props);
    }

    get value (): string {
        return this.props.lastName;
    }
    
    public static create (props: IUserLastName): Result<UserLastName> {
        if(validator.isEmpty(props.lastName))
          return Result.fail<UserLastName>(`The last name is null or undefined`)
        if(!validator.minLength(props.lastName, this.minLength))
          return Result.fail<UserLastName>(`The last name min length invalid`)
        if(!validator.maxLength(props.lastName, this.maxLength))
          return Result.fail<UserLastName>(`The last name max length invalid`)
    
        const userLastName = new UserLastName(props)
        return Result.OK<UserLastName>(userLastName);
    }
}
