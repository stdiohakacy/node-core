import { TagDb } from './../../../infra/TagDb';
import { IMapper } from "../../../shared/IMapper"
import { Tag } from "./entities/Tag";
import { UniqueEntityId } from '../../../shared/domain/UniqueEntityId';

export class TagMapper implements IMapper<Tag> {
    public static toDomain(tagDb: TagDb): Tag | null {
        if(!tagDb) return null

        const tagOrError = Tag.create({
            name: tagDb.name
        }, new UniqueEntityId(tagDb.id))

        if(tagOrError.isFailure)
            console.error(tagOrError.error)
        return tagOrError.isSuccess ? tagOrError.getValue() : null
    }
}
