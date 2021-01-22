import { MessageError, ContentError } from './../../../../shared/exceptions/MessageError';
import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserCultureProps {
    value: string
}

export class UserCulture extends ValueObject<IUserCultureProps> {
    public static maxLength: number = 5;

    private constructor (props: IUserCultureProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserCultureProps): Result<UserCulture> {
        props.value = props.value.trim()

        if(!validator.isEmpty(props.value)) {
            return Result.fail<UserCulture>(
                new MessageError(ContentError.PARAM_REQUIRED(), 'culture').getMessage()
            )
        }
        if(props.value.length !== this.maxLength)
            return Result.fail<UserCulture>(
                new MessageError(
                    ContentError.PARAM_LEN_EQUAL(), 
                    'culture', 
                    this.maxLength
                ).getMessage()
            )

        return Result.OK<UserCulture>(new UserCulture({value: props.value}))
    }
}
