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
          return Result.fail<UserFirstName>(`The first name is null or undefined`)
        if(!validator.minLength(props.value, this.minLength))
          return Result.fail<UserFirstName>(`The first name min length invalid`)
        if(!validator.maxLength(props.value, this.maxLength))
          return Result.fail<UserFirstName>(`The first name max length invalid`)
    
        const userFirstName = new UserFirstName(props)
        return Result.OK<UserFirstName>(userFirstName);
      }

}
