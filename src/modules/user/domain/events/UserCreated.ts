import { User } from './../aggregateRoot/User';
import { UniqueEntityId } from '../../../../shared/domain/UniqueEntityId';
import { IDomainEvent } from './../../../../shared/domain/events/IDomainEvent';

export class UserCreated implements IDomainEvent {
    dateTimeOccurred: Date;
    public user: User

    constructor(user: User) {
        this.dateTimeOccurred = new Date();
        this.user = user
    }

    getAggregateId(): UniqueEntityId {
        return this.user.id
    }
}
