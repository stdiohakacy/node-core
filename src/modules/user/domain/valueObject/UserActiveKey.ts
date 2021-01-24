import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserActiveKeyProps {
    value: string
}

export class UserActiveKey extends ValueObject<IUserActiveKeyProps> {
    private constructor (props: IUserActiveKeyProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserActiveKeyProps): Result<UserActiveKey> {
        // if(validator.isEmpty(props.value)) {
        //     return Result.fail<UserActiveKey>(
        //         new MessageError(ContentError.PARAM_REQUIRED(), 'active key').getMessage()
        //     )
        // }
        return Result.OK<UserActiveKey>(
            new UserActiveKey({ value: props.value })
        )
    }
}
