export class Pagination {
    constructor(public skip: number, public limit: number, public  total: number) {
        this.skip = skip
        this.limit = limit
        this.total = total
    }
}

export class PaginationResult<T> {
    public pagination: Pagination

    constructor(public data: T[], public total: number, public skip: number, public limit: number) {
        this.pagination = new Pagination(skip, limit, total)
        this.data = data
    }
}
