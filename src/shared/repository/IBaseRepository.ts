export interface IBaseRepository<TEntity, TIdentityType> {
    findAndCount(filter: any): Promise<[TEntity[], number]>

    getById(id: TIdentityType): Promise<TEntity>
    
    create(data: TEntity): Promise<TIdentityType>
    
    update(id: TIdentityType, data: TEntity): Promise<boolean>
    
    delete(id: TIdentityType | TIdentityType[]): Promise<boolean>
}
