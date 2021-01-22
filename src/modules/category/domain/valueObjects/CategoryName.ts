import { MessageError, ContentError } from './../../../../shared/exceptions/MessageError';
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'
interface IUserNameProps {
  value: string;
}

export class CategoryName extends ValueObject<IUserNameProps> {
  public static maxLength: number = 150;
  public static minLength: number = 15;

  get value (): string {
    return this.props.value;
  }

  private constructor (props: IUserNameProps) {
    super(props);
  }

  public static create (props: IUserNameProps): Result<CategoryName> {
    if(validator.isEmpty(props.value))
      return Result.fail<CategoryName>(new MessageError(ContentError.PARAM_REQUIRED(), 'name').getMessage())
    if(!validator.minLength(props.value, this.minLength))
      return Result.fail<CategoryName>(new MessageError(ContentError.PARAM_LEN_GREATER_OR_EQUAL(), 'name', this.minLength).getMessage())
    if(!validator.maxLength(props.value, this.maxLength))
      return Result.fail<CategoryName>(new MessageError(ContentError.PARAM_LEN_LESS_OR_EQUAL(), 'name', this.maxLength).getMessage())

    const categoryName = new CategoryName(props)
    return Result.OK<CategoryName>(categoryName);
  }
}
