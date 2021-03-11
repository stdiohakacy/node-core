import { ProductTagDb } from "../../../../infra/ProductTagDb";
import { IBaseRepository } from "../../../../shared/repository/BaseRepository";

export interface IProductTagRepository extends IBaseRepository<ProductTagDb, string> {}