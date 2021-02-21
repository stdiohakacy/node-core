import { Guard } from './../../../../../shared/core/Guard';
import { Result } from './../../../../../shared/core/Result';
import { Entity } from '../../../../../shared/domain/Entity';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { UserId } from './../../../../user/domain/entity/UserId';
import { ChannelId } from "./ChannelId";

interface IChannelUserProps {
    channelId: ChannelId,
    userId: UserId
    isMute?: boolean;
}

export class ChannelUser extends Entity<IChannelUserProps> {
    get id(): UniqueEntityId {
        return this._id;
    }

    get channelId(): ChannelId {
        return this.props.channelId;
    }

    get userId(): UserId {
        return this.props.userId;
    }

    get isMute(): boolean {
        return this.props.isMute;
    }

    public static create(props: IChannelUserProps, id?: UniqueEntityId): Result<ChannelUser> {
        const guardResult = Guard.againstNullOrUndefinedBulk([
            { argument: props.channelId, argumentName: 'channelId' },
            { argument: props.userId, argumentName: 'userId' },
        ]);

        if (!guardResult.succeeded)
            return Result.fail<ChannelUser>(guardResult.message);
        return Result.OK<ChannelUser>(new ChannelUser(props, id));
    }
}
