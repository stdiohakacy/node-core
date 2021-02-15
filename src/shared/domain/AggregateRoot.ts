import { IDomainEvent } from './events/IDomainEvent';
import { Entity } from "./Entity";
import { UniqueEntityId } from "./UniqueEntityId";
import { DomainEvents } from './events/DomainEvents';

export abstract class AggregateRoot<T> extends Entity<T> {
    private _domainEvents: IDomainEvent[] = []

    get id (): UniqueEntityId {
        return this._id;
    }

    get domainEvents(): IDomainEvent[] {
        return this._domainEvents
    }

    protected addDomainEvent(domainEvent: IDomainEvent): void {
        this._domainEvents.push(domainEvent)
        DomainEvents.markAggregateForDispatch(this)
        this.logDomainAdded(domainEvent)
    }

    private logDomainAdded(domainEvent: IDomainEvent): void {
        const thisClass = Reflect.getPrototypeOf(this);
        const domainEventClass = Reflect.getPrototypeOf(domainEvent);
        console.info(`[Domain Event Created]:`, thisClass.constructor.name, '==>', domainEventClass.constructor.name)
    }
}
