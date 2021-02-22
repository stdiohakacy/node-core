import { Result } from "../../../../../shared/core/Result";
import { Entity } from "../../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";
import { MessageError, SystemError } from "../../../../../shared/exceptions/SystemError";

export class MessageId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<MessageId> {
        if (!id)
            return Result.fail<MessageId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'message id').message
            )
        return Result.OK<MessageId>(new MessageId(id));
    }
}
