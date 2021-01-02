import { IBaseRepository } from "../../../shared/repository/IBaseRepository";
import { Category } from "../domain/entity/Category";

export interface ICategoryRepository extends IBaseRepository<Category, string>{

}
