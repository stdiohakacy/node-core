import { TagDb } from "../../../../infra/TagDb";
import { IBaseRepository } from "../../../../shared/repository/BaseRepository";

export interface ITagRepository extends IBaseRepository<TagDb, string> {
    isNameExist(name: string): Promise<boolean>
    getTagsName(): Promise<TagDb[]>
}