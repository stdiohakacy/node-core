import { Guard } from "../../../../shared/core/Guard";
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { CategoryId } from "../entities/CategoryId";
import { CategoryName } from "../valueObjects/CategoryName";

interface ICategoryProps {
    name: CategoryName;
}
export class Category extends AggregateRoot<ICategoryProps> {
    private constructor (props: ICategoryProps, id?: UniqueEntityId) {
        super(props, id)
    }

    get categoryId (): CategoryId {
        return CategoryId.create(this._id).getValue();
    }

    get name (): CategoryName {
        return this.props.name;
    }

    public static create (props: ICategoryProps, id?: UniqueEntityId): Result<Category> {
        const guardResult = Guard.againstNullOrUndefined(props.name, 'name')
        if(!guardResult.succeeded)
            return Result.fail<Category>(guardResult.message)

        const category = new Category({...props}, id)
        return Result.OK<Category>(category);
    }
}
