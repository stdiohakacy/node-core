import { Result } from "../../../../shared/core/Result";
import { CategoryId } from "../entity/CategoryId";
import { CategoryName } from "../valueObjects/CategoryName";
import * as validator from 'class-validator'
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { ContentError, MessageError } from "../../../../shared/exceptions/MessageError";

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
        if(validator.isEmpty(props.name)) {
            return Result.fail<Category>(new MessageError(ContentError.PARAM_REQUIRED(), 'name').getMessage())
        }

        const category = new Category({...props}, id)
        return Result.OK<Category>(category);
    }
}
