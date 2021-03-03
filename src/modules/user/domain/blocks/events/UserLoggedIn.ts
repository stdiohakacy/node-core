import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { User } from './../aggregateRoot/User';

export class UserLoggedIn implements IDomainEvent {
    dateTimeOccurred: Date;
    public user: User

    constructor(user: User) {
        this.dateTimeOccurred = new Date()
        this.user = user
    }

    getAggregateId(): UniqueEntityId {
        return this.user.id
    }
}
