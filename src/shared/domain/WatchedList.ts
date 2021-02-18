export interface IWatchedList<T> {
    getItems(): T[]
    getNewItems(): T[]
    getRemovedItems(): T[]
    exists(item: T): boolean
    add(item: T): void
    remove(item: T): void
}

export abstract class WatchedList<T> implements IWatchedList<T> {
    private _initial: T[]
    private _new: T[]
    private removed: T[]
    public currentItems: T[]

    constructor(initItems?: T[]) {
        this.currentItems = initItems || []
        this._initial = initItems || []
        this._new = []
        this.removed = []
    }

    abstract compareItems(a: T, b: T): boolean

    public getItems(): T[] {
        return this.currentItems
    }

    public getNewItems(): T[] {
        return this._new
    }

    public getRemovedItems(): T[] {
        return this.removed
    }

    public exists(item: T): boolean {
        return this.isCurrentItem(item)
    }

    public add(item: T): void {
        if (this.isRemovedItem(item)) {
            this.removeFromRemoved(item);
        }

        if (!this.isNewItem(item) && !this.wasAddedInitially(item)) {
            this._new.push(item);
        }

        if (!this.isCurrentItem(item)) {
            this.currentItems.push(item);
        }
    }

    public remove(item: T): void {
        this.removeFromCurrent(item);

        if (this.isNewItem(item)) {
            this.removeFromNew(item);
            return;
        }

        if (!this.isRemovedItem(item)) {
            this.removed.push(item);
        }
    }

    private isCurrentItem(item: T): boolean {
        return this.currentItems.filter((i: T) => this.compareItems(item, i)).length !== 0
    }

    private isNewItem(item: T): boolean {
        return this._new.filter((i: T) => this.compareItems(item, i)).length !== 0
    }

    private isRemovedItem(item: T): boolean {
        return this.removed.filter((v: T) => this.compareItems(item, v)).length !== 0
    }

    private removeFromNew(item: T): void {
        this._new = this._new.filter((i: T) => !this.compareItems(i, item));
    }

    private removeFromCurrent(item: T): void {
        this.currentItems = this.currentItems.filter((i: T) => !this.compareItems(item, i))
    }

    private removeFromRemoved(item: T): void {
        this.removed = this.removed.filter((i: T) => !this.compareItems(item, i))
    }

    private wasAddedInitially(item: T): boolean {
        return this._initial.filter(
            (i: T) => this.compareItems(item, i)
        ).length !== 0
    }
}
