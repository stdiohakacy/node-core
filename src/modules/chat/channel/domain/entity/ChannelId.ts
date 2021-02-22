import { Result } from './../../../../../shared/core/Result';
import { Entity } from "../../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";
import { MessageError, SystemError } from '../../../../../shared/exceptions/SystemError';

export class ChannelId extends Entity<any> {
    private constructor(id?: UniqueEntityId) {
        super(null, id)
    }

    get id(): UniqueEntityId {
        return this._id;
    }

    public static create(id: UniqueEntityId): Result<ChannelId> {
        if (!id)
            return Result.fail<ChannelId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'channel id').message
            )

        return Result.OK<ChannelId>(new ChannelId(id));
    }
}
