import { Result } from './../../../../../shared/core/Result';
import { Entity } from "../../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";

export class ChannelId extends Entity<any> {
    private constructor (id?: UniqueEntityId) {
        super(null, id)
    }

    get id (): UniqueEntityId {
        return this._id;
    }

    public static create (id: UniqueEntityId): Result<ChannelId> {
        return Result.OK<ChannelId>(new ChannelId(id));
    }
}
