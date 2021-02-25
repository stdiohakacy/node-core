import { MessageError } from '../../../../../shared/exceptions/SystemError';
import * as validator from 'class-validator'
import { Result } from '../../../../../shared/core/Result';
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { SystemError } from '../../../../../shared/exceptions/SystemError';

interface IPrivateMessageMsgProps {
    value: string;
}

export class PrivateMessageMsg extends ValueObject<IPrivateMessageMsgProps> {
    public static maxLength: number = 500;

    private constructor(props: IPrivateMessageMsgProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IPrivateMessageMsgProps): Result<PrivateMessageMsg> {
        if (!props || !props.value)
            return Result.fail<PrivateMessageMsg>(
                new SystemError(MessageError.PARAM_REQUIRED, 'message').message
            )
        if (props.value.length > this.maxLength)
            return Result.fail<PrivateMessageMsg>(
                new SystemError(MessageError.PARAM_LEN_MAX, 
                    'message', 
                    this.maxLength
                ).message
            )
        return Result.OK<PrivateMessageMsg>(new PrivateMessageMsg(props));
    }
}
