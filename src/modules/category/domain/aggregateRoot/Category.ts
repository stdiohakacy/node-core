import { Guard } from './../../../../shared/core/Guard';
import { Result } from "../../../../shared/core/Result";
import { CategoryId } from "../entity/CategoryId";
import { CategoryName } from "../valueObjects/CategoryName";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";

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
        const guard = Guard.againstNullOrUndefined(props.name, 'name')
        if(!guard.succeeded)
            return Result.fail<Category>(guard.message)

        const category = new Category({...props}, id)
        return Result.OK<Category>(category);
    }
}
