import "reflect-metadata"
import { injectable } from "inversify";
import { getRepository, Repository } from "typeorm";
import { IBaseRepository } from "./IBaseRepository";
@injectable()
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

    async update(id: TIdentityType, data: IEntity): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .update(data)
            .whereInIds(id)
            .execute()
        return !!result.affected
    }

    async delete(ids: TIdentityType | TIdentityType[]): Promise<boolean> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .delete()
            .whereInIds(ids)
            .execute()
        return !!result.affected
    }
}
