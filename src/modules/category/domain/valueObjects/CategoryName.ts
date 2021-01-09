import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/core/ValueObject";
import * as validator from 'class-validator'
interface IUserNameProps {
  name: string;
}

export class CategoryName extends ValueObject<IUserNameProps> {
  public static maxLength: number = 150;
  public static minLength: number = 15;

  get value (): string {
    return this.props.name;
  }

  private constructor (props: IUserNameProps) {
    super(props);
  }

  public static create (props: IUserNameProps): Result<CategoryName> {
    if(validator.isEmpty(props.name))
      return Result.fail<CategoryName>(`The category name is null or undefined`)
    if(!validator.minLength(props.name, this.minLength))
      return Result.fail<CategoryName>(`The category name min length invalid`)
    if(!validator.maxLength(props.name, this.maxLength))
      return Result.fail<CategoryName>(`The category name max length invalid`)

    const categoryName = new CategoryName(props)
    return Result.OK<CategoryName>(categoryName);
  }
}
