import { Entity } from "../../../../shared/core/Entity";
import { Result } from "../../../../shared/core/Result";
import { UniqueEntityId } from "../../../../shared/core/UniqueEntityId";

export class CategoryId extends Entity<any> {
  private constructor (id?: UniqueEntityId) {
    super(null, id)
  }

  get id (): UniqueEntityId {
    return this._id;
  }

  public static create (id?: UniqueEntityId): Result<CategoryId> {
    const categoryId = new CategoryId(id) 
    return Result.OK<CategoryId>(categoryId);
  }
}