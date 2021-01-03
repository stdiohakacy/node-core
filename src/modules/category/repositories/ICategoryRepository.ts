import { IBaseRepository } from "../../../shared/repository/IBaseRepository";
import { CategoryDb } from "../domain/entity/CategoryDb";

export interface ICategoryRepository extends IBaseRepository<CategoryDb, string> {
    isExist(name: string): Promise<boolean>
}
