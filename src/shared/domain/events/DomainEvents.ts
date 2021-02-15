import { UniqueEntityId } from './../UniqueEntityId';
import { AggregateRoot } from "../AggregateRoot"

export class DomainEvents {
    private static handlersMap = {}
    private static markedAggregates: AggregateRoot<any>[] = []

    public static markAggregateForDispatch(aggregate: AggregateRoot<any>): void {
        const isFound = !!this.findMarkedAggregateById(aggregate.id)
        if(!isFound)
            this.markedAggregates.push(aggregate)
    }

    private static findMarkedAggregateById(id: UniqueEntityId): AggregateRoot<any> {
        let aggregateFounded = null
        for (const aggregate of this.markedAggregates) {
            if(aggregate.id.equals(id))
                aggregateFounded = aggregate
        }
        return aggregateFounded
    }
}
