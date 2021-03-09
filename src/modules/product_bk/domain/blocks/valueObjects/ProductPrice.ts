import { Result } from "../../../../../shared/core/Result";
import { ValueObject } from "../../../../../shared/domain/ValueObject";
import { MessageError, SystemError } from "../../../../../shared/exceptions/SystemError";

interface IProductPriceProps {
    value: number;
}

export class ProductPrice extends ValueObject<IProductPriceProps> {
    public static maxValue: number = 999999;
    public static minValue: number = 0;

    private constructor(props: IProductPriceProps) {
        super(props);
    }

    get value(): number {
        return this.props.value;
    }

    public static create(props: IProductPriceProps): Result<ProductPrice> {
        if(props.value < this.minValue || props.value > this.maxValue) {
            return Result.fail<ProductPrice>(
                new SystemError(
                    MessageError.PARAM_LEN_BETWEEN, 
                    'produce price', 
                    this.minValue, 
                    this.maxValue
                ).message
            )
        }
        return Result.OK<ProductPrice>(new ProductPrice(props));
    }
}
