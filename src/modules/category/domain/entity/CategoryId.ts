import { Result } from "../../../../shared/core/Result";
import * as validator from 'class-validator'
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { ContentError, MessageError } from "../../../../shared/exceptions/MessageError";

export class CategoryId extends Entity<any> {
  private constructor (id?: UniqueEntityId) {
    super(null, id)
  }

  get id (): UniqueEntityId {
    return this._id;
  }

  public static create (id: UniqueEntityId): Result<CategoryId> {
    if(validator.isEmpty(id)) {
      return Result.fail<CategoryId>(new MessageError(ContentError.PARAM_REQUIRED(), 'id').getMessage())
    }
    if(!validator.isUUID(id.toValue()))
        return Result.fail<CategoryId>(new MessageError(ContentError.PARAM_INVALID(), 'id').getMessage())
        
    const categoryId = new CategoryId(id) 
    return Result.OK<CategoryId>(categoryId);
  }
}
