import { Entity } from "./Entity";
import { UniqueEntityId } from "./UniqueEntityId";

export abstract class AggregateRoot<T> extends Entity<T> {
  get id (): UniqueEntityId {
    return this._id;
  }
}
