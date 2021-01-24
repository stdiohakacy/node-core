import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'
import { MessageError, SystemError } from "../../../../shared/exceptions/SystemError";
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
            throw new SystemError(MessageError.PARAM_REQUIRED, 'name')
        if(!validator.minLength(props.value, this.minLength)) {
            throw new SystemError(MessageError.PARAM_LEN_GREATER_OR_EQUAL, 'name', this.minLength)
        }
        if(!validator.maxLength(props.value, this.maxLength))
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', this.maxLength)

        const categoryName = new CategoryName(props)
        return Result.OK<CategoryName>(categoryName);
    }
}
