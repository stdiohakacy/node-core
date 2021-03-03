import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';

interface IProductNameProps {
    value: string;
}

export class ProductName extends ValueObject<IProductNameProps> {
    public static maxLength: number = 150;
    public static minLength: number = 15;

    private constructor(props: IProductNameProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IProductNameProps): Result<ProductName> {
        if (validator.isEmpty(props.value))
            return Result.fail<ProductName>(
                new SystemError(MessageError.PARAM_REQUIRED, 'product name').message
            )
        if (
            !validator.minLength(props.value, this.minLength) ||
            !validator.maxLength(props.value, this.maxLength)
        )
            return Result.fail<ProductName>(
                new SystemError(MessageError.PARAM_LEN_BETWEEN, 
                    'product name', 
                    this.minLength, 
                    this.maxLength
                ).message
            )
        return Result.OK<ProductName>(new ProductName(props));
    }
}
