export interface ICategoryRepository<TEntity> {
    findAndCount(): Promise<[TEntity, number]>
    getById(id: string): Promise<TEntity>
    create(data: any): Promise<string>
    update(id: string, data: any): Promise<boolean>
    delete(id: string): Promise<boolean>
}
