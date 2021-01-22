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
          return Result.fail<UserLastName>(`The last name is null or undefined`)
        if(!validator.minLength(props.value, this.minLength))
          return Result.fail<UserLastName>(`The last name min length invalid`)
        if(!validator.maxLength(props.value, this.maxLength))
          return Result.fail<UserLastName>(`The last name max length invalid`)
    
        const userLastName = new UserLastName(props)
        return Result.OK<UserLastName>(userLastName);
    }
}
