import { Guard } from "../../../../../shared/core/Guard";
import { Result } from "../../../../../shared/core/Result";
import { Entity } from "../../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../../shared/domain/UniqueEntityId";

export interface ITagProps {
    name: string
}

export class Tag extends Entity<ITagProps> {
    get name(): string {
        return this.props.name
    }

    public static create(props: ITagProps, id?: UniqueEntityId): Result<Tag> {
        const guardResult = Guard.againstNullOrUndefined(props.name, 'name')
        if(!guardResult.succeeded)
            return Result.fail<Tag>(guardResult.message)

        const tag = new Tag({...props}, id)
        return Result.OK<Tag>(tag);
    }
}