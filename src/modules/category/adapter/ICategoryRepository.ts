import { IBaseRepository } from "../../../shared/repository/BaseRepository";
import { CategoryDb } from "../infra/databases/typeorm/entities/CategoryDb";

export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(id: string): Promise<boolean>
    isNameExist(name: string): Promise<boolean>
}