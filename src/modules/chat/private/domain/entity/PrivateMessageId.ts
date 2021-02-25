import { MessageError } from '../../../../../shared/exceptions/SystemError';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { Entity } from "../../../../../shared/domain/Entity";
import { Result } from '../../../../../shared/core/Result';
import { SystemError } from '../../../../../shared/exceptions/SystemError';

export class PrivateMessageId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<PrivateMessageId> {
        if (!id)
            return Result.fail<PrivateMessageId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'private message id').message
            )
        return Result.OK<PrivateMessageId>(new PrivateMessageId(id));
    }
}
