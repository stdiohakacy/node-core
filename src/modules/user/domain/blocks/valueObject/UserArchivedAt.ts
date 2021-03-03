import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError, MessageError } from '../../../../../shared/exceptions/SystemError';

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
        if(validator.isEmpty(props.value))
            throw new SystemError(MessageError.PARAM_REQUIRED, 'archived at')
        if(!validator.isDate(props.value))
            throw new SystemError(MessageError.DATA_INVALID)
            
        return Result.OK<UserArchivedAt>(new UserArchivedAt({value: props.value}))
    }
}
