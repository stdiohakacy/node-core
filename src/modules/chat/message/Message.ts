import { Guard } from './../../../shared/core/Guard';
import { MessageContent } from './MessageContent';
import { MessageId } from './MessageId';
import { AggregateRoot } from "../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../shared/domain/UniqueEntityId";
import { Result } from '../../../shared/core/Result';
import { ChannelId } from '../channel/domain/entity/ChannelId';
import { UserId } from '../../user/domain/entity/UserId';

interface IMessageProps {
    content: MessageContent
    channelId: ChannelId,
    userId: UserId
}

export class Message extends AggregateRoot<IMessageProps> {
    private constructor (props: IMessageProps, id?: UniqueEntityId) {
        super(props, id)
    }

    get MessageId (): MessageId {
        return MessageId.create(this._id).getValue();
    }

    get content(): MessageContent {
        return this.props.content;
    }

    get channelId(): ChannelId {
        return this.props.channelId
    }

    get userId(): UserId {
        return this.props.userId
    }

    public static create (props: IMessageProps, id?: UniqueEntityId): Result<Message> {
        const guardResult = Guard.againstNullOrUndefined(props.content, 'content')
        if(!guardResult.succeeded)
            return Result.fail<Message>(guardResult.message)

        const category = new Message({...props}, id)
        return Result.OK<Message>(category);
    }
}
