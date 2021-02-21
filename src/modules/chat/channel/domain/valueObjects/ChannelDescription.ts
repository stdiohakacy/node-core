import { Result } from './../../../../../shared/core/Result';
import * as validator from 'class-validator'
import { ValueObject } from '../../../../../shared/domain/ValueObject';
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';

interface IChannelDescriptionProps {
    value: string;
}

export class ChannelDescription extends ValueObject<IChannelDescriptionProps> {
    public static maxLength: number = 500;
    public static minLength: number = 5;

    get value (): string {
        return this.props.value;
    }

    private constructor (props: IChannelDescriptionProps) {
        super(props);
    }

    public static create (props: IChannelDescriptionProps): Result<ChannelDescription> {
        if(validator.isEmpty(props.value)) {
            return Result.fail<ChannelDescription>(
                new SystemError(MessageError.PARAM_REQUIRED, 'channel description').message.toString()
            )
        }
        if(
            !validator.minLength(props.value, this.minLength) || 
            !validator.maxLength(props.value, this.maxLength)
        )
            return Result.fail<ChannelDescription>(
                new SystemError(
                    MessageError.PARAM_LEN_BETWEEN, 
                    'channel description', 
                    this.minLength, 
                    this.maxLength
                ).message)
        return Result.OK<ChannelDescription>(new ChannelDescription(props));
    }
}
