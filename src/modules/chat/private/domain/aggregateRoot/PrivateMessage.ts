import { UniqueEntityId } from './../../../../../shared/domain/UniqueEntityId';
import { UserId } from './../../../../user/domain/entity/UserId';
import { AggregateRoot } from '../../../../../shared/domain/AggregateRoot';
import { PrivateMessageId } from '../entity/PrivateMessageId';
import { Result } from '../../../../../shared/core/Result';
import { Guard } from '../../../../../shared/core/Guard';
import { PrivateMessageMsg } from '../valueObjects/PrivateMessageMsg';

interface IPrivateMessageProps {
    fromUserId: UserId
    toUserId: UserId
    message: PrivateMessageMsg
}

export class PrivateMessage extends AggregateRoot<IPrivateMessageProps> {
    private constructor (props: IPrivateMessageProps, id?: UniqueEntityId) {
        super(props, id)
    }

    get privateMessageId(): PrivateMessageId {
        return PrivateMessageId.create(this._id).getValue()
    }

    get fromUserId(): UserId {
        return this.props.fromUserId
    }

    get toUserId(): UserId {
        return this.props.toUserId
    }

    get privateMessageMsg(): PrivateMessageMsg {
        return this.props.message
    }


    public static create (props: IPrivateMessageProps, id?: UniqueEntityId): Result<PrivateMessage> {
        const guard = Guard.againstNullOrUndefinedBulk([
            { argument: props.fromUserId, argumentName: 'from user id' },
            { argument: props.toUserId, argumentName: 'to user id' },
            { argument: props.message, argumentName: 'message' },
        ])
        if(!guard.succeeded)
            return Result.fail<PrivateMessage>(guard.message)

        const privateMessage = new PrivateMessage({...props}, id)
        return Result.OK<PrivateMessage>(privateMessage);
    }
}
