import { Result } from './../../../shared/core/Result';
import { ValueObject } from '../../../shared/domain/ValueObject';

interface IMessageContentProps {
    value: string;
}

export class MessageContent extends ValueObject<IMessageContentProps> {
    get value (): string {
        return this.props.value;
    }

    private constructor (props: IMessageContentProps) {
        super(props);
    }

    public static create (props: IMessageContentProps): Result<MessageContent> {
        return Result.OK<MessageContent>(new MessageContent(props));
    }
}
