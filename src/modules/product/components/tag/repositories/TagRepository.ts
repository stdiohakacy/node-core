import { Service } from "typedi";
import { TagDb } from "../../../../../infra/TagDb";
import { BaseRepository } from "../../../../../shared/repository/BaseRepository";
import { ITagRepository } from "../adapter/ITagRepository";

@Service('tag.repository')
export class TagRepository extends BaseRepository<TagDb, string> implements ITagRepository {
    constructor() {
        super(TagDb, {
            TABLE_NAME: 'tag'
        })
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('tag')
            .where(`LOWER(tag.name) = LOWER(:name)`, { name });
        return !!await query.getOne();
    }

    async getTagsName(): Promise<TagDb[]> {
        return await this.repository
        .createQueryBuilder('tag')
        .select("tag.name")
        .addSelect("tag.id")
        .getMany()
    }
}
