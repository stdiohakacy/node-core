import { getRepository, Repository } from "typeorm";

export interface IBaseRepository<TEntity, TIdentityType> {
    findAndCount(filter: any): Promise<[TEntity[], number]>
    getById(id: TIdentityType): Promise<TEntity>
    create(data: TEntity): Promise<TIdentityType>
    createMultiple(list: TEntity[]): Promise<TIdentityType[]>;
    createGet(data: TEntity): Promise<TEntity>
    update(id: TIdentityType, data: TEntity): Promise<boolean>
    delete(id: TIdentityType | TIdentityType[]): Promise<boolean>
    softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean>;
}


export abstract class BaseRepository<IEntity, TIdentityType> 
implements IBaseRepository<IEntity, TIdentityType> {
    protected readonly repository: Repository<IEntity>

    constructor(
        private _type: { new(): IEntity },
        private _schema: { TABLE_NAME: string }
    ){
        this.repository = getRepository(this._type)
    }
    
    async findAndCount(filter: any): Promise<[IEntity[], number]> {
        const query = this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .skip(filter.skip)
            .take(filter.limit)
        
        return await query.getManyAndCount()
    }

    async getById(id: TIdentityType): Promise<IEntity> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .whereInIds(id)
            .getOne()
        return result
    }

    async create(data: IEntity): Promise<TIdentityType> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .insert()
            .values(data)
            .execute()
        return result.identifiers
            && result.identifiers.length
            && result.identifiers[0].id
    }

    async createMultiple(list: IEntity[]): Promise<TIdentityType[]> {
        const result = await this.repository
        .createQueryBuilder(this._schema.TABLE_NAME)
            .insert()
            .values(list.map(item => item))
            .execute();
        return result.identifiers && result.identifiers.length ? result.identifiers.map(identifier => identifier.id) : [];
    }

    async createGet(data: IEntity): Promise<IEntity> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .insert()
            .values(data)
            .execute()
        const id = result.identifiers && result.identifiers.length && result.identifiers[0].id
        
        if(id)
            return await this.getById(id)
    }

    async update(id: TIdentityType, data: IEntity): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .update(data)
            .whereInIds(id)
            .execute()
        return !!result.affected
    }

    async delete(ids: TIdentityType | TIdentityType[]): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(this._schema.TABLE_NAME)
            .delete()
            .whereInIds(ids)
            .execute();
        return !!result.affected;
    }
    
    async softDelete(ids: TIdentityType | TIdentityType[]): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .softDelete()
            .whereInIds(ids)
            .execute();
        return !!result.affected;
    }
}
