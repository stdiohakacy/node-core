import { SystemError } from './../../../../shared/exceptions/SystemError';
import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { MessageError } from "../../../../shared/exceptions/SystemError";

export class UserId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<UserId> {
        if (!id)
            return Result.fail<UserId>(
                new SystemError(MessageError.PARAM_REQUIRED, 'user id').message
            )
        return Result.OK<UserId>(new UserId(id));
    }
}
