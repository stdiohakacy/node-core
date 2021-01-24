import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";

export interface IUserArchivedAtProps {
    value: string
}

export class UserArchivedAt extends ValueObject<IUserArchivedAtProps> {
    private constructor (props: IUserArchivedAtProps) {
        super(props);
    }

    get value(): string {
        return this.props.value
    }

    public static create(props: IUserArchivedAtProps): Result<UserArchivedAt> {
        // if(validator.isEmpty(props.value)) {
        //     return Result.fail<UserArchivedAt>(
        //         new MessageError(
        //             ContentError.PARAM_REQUIRED(), 
        //             'address'
        //         ).getMessage())
        // }
        // if(!validator.isDate(props.value)) {
        //     return Result.fail<UserArchivedAt>(
        //         new MessageError(ContentError.DATA_INVALID()).getMessage()
        //     )
        // }
        return Result.OK<UserArchivedAt>(new UserArchivedAt({value: props.value}))
    }
}
