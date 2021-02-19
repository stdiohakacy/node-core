import { Guard } from '../../../../shared/core/Guard';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityId } from '../../../../shared/domain/UniqueEntityId';
import { Result } from '../../../../shared/core/Result';
import { ChannelId } from '../entity/ChannelId';
import { ChannelName } from '../valueObjects/ChannelName';
import { ChannelDescription } from '../valueObjects/ChannelDescription';
import { ChannelUsers } from '../../watchedList/ChannelUsers';
export interface IChannelProps {
    name?: ChannelName,
    description?: ChannelDescription,
    isDirect?: boolean,
    isPrivate?: boolean,
    lastSeen?: Record<string, any>,
    lastMessageId?: string,
    lastMessageCreatedAt?: Date,
    
    // relationship
    users?: ChannelUsers,
}

export class Channel extends AggregateRoot<IChannelProps> {
    private constructor(props: IChannelProps, id?: UniqueEntityId) {
        super(props, id)
    }

    get channelId(): ChannelId {
        return ChannelId.create(this._id).getValue()
    }

    get name(): ChannelName {
        return this.props.name
    }

    get description(): ChannelDescription {
        return this.props.description
    }

    get isDirect(): boolean {
        return this.props.isDirect
    }

    get isPrivate(): boolean {
        return this.props.isPrivate
    }

    get lastSeen(): Record<string, any> {
        return this.props.lastSeen
    }

    get lastMessageId(): string {
        return this.props.lastMessageId
    }

    get lastMessageCreatedAt(): Date {
        return this.props.lastMessageCreatedAt
    }

    get users(): ChannelUsers {
        return this.props.users
    }
    
    public static create(props: IChannelProps, id?: UniqueEntityId): Result<Channel> {
        const guard = Guard.againstNullOrUndefinedBulk([])

        if(!guard.succeeded)
            return Result.fail<Channel>(guard.message)
        const channel = new Channel({
            ...props,
            users: props.users || ChannelUsers.create([])
        }, id)
        return Result.OK<Channel>(channel)
    }
}
