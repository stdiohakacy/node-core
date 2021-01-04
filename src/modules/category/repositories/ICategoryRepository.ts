import { IBaseRepository } from "../../../shared/repository/IBaseRepository";
import { CategoryDb } from "../infra/databases/typeorm/entities/CategoryDb";

export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(name: string): Promise<boolean>
}
