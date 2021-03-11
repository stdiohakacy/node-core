import { CategoryDb } from "../../../../infra/CategoryDb";
import { IBaseRepository } from "../../../../shared/repository/BaseRepository";

export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(id: string): Promise<boolean>
    isNameExist(name: string): Promise<boolean>
}