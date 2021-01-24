import { SystemError, MessageError } from './../../../../shared/exceptions/SystemError';
import { Result } from "../../../../shared/core/Result";
import * as validator from 'class-validator'
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";

export class UserId extends Entity<any> {
  private constructor (id?: UniqueEntityId) {
    super(null, id)
  }

  get id (): UniqueEntityId {
    return this._id;
  }

  public static create (id: UniqueEntityId): Result<UserId> {
    if(validator.isEmpty(id)) {
    //   return Result.fail<UserId>(new MessageError(ContentError.PARAM_REQUIRED(), 'id').getMessage())
        throw new SystemError(MessageError.PARAM_REQUIRED, 'id')
    }
    if(!validator.isUUID(id.toValue()))
        // return Result.fail<UserId>(new MessageError(ContentError.PARAM_INVALID(), 'id').getMessage())

        throw new SystemError(MessageError.PARAM_INVALID, 'id')
        
    const userId = new UserId(id) 
    return Result.OK<UserId>(userId);
  }
}
