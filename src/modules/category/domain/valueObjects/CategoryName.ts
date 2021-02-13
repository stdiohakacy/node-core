import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'
import { MessageError, SystemError } from "../../../../shared/exceptions/SystemError";
interface ICategoryNameProps {
    value: string;
}

export class CategoryName extends ValueObject<ICategoryNameProps> {
    public static maxLength: number = 150;
    public static minLength: number = 15;

    get value (): string {
        return this.props.value;
    }

    private constructor (props: ICategoryNameProps) {
        super(props);
    }

    public static create (props: ICategoryNameProps): Result<CategoryName> {
        if(validator.isEmpty(props.value)) {
            return Result.fail<CategoryName>('The category name is required')
        }
        if(
            !validator.minLength(props.value, this.minLength) || 
            !validator.maxLength(props.value, this.maxLength)
        ) {
            return Result.fail<CategoryName>(`The length of category name must be between ${this.minLength} and ${this.maxLength}!`)
        }
        return Result.OK<CategoryName>(new CategoryName(props));
    }
}
