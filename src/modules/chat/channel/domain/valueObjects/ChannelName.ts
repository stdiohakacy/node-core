import { Result } from './../../../../../shared/core/Result';
import * as validator from 'class-validator'
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';

interface IChannelNameProps {
    value: string;
}

export class ChannelName extends ValueObject<IChannelNameProps> {
    public static maxLength: number = 150;
    public static minLength: number = 15;

    get value (): string {
        return this.props.value;
    }

    private constructor (props: IChannelNameProps) {
        super(props);
    }

    public static create (props: IChannelNameProps): Result<ChannelName> {
        if(validator.isEmpty(props.value)) {
            return Result.fail<ChannelName>(
                new SystemError(MessageError.PARAM_REQUIRED, 'channel name').message.toString()
            )
        }
        if(
            !validator.minLength(props.value, this.minLength) || 
            !validator.maxLength(props.value, this.maxLength)
        ) {
            return Result.fail<ChannelName>(
                new SystemError(
                    MessageError.PARAM_LEN_BETWEEN, 
                    'channel name', 
                    this.minLength, 
                    this.maxLength
                ).message)
        }
        return Result.OK<ChannelName>(new ChannelName(props));
    }
}
