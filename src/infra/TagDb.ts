import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { ProductTagDb } from "./ProductTagDb";

@Entity('tag')
export class TagDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @OneToMany(() => ProductTagDb, productTags => productTags.tag)
    productTags: ProductTagDb[];

    @Column({ name: 'name', length: 150 })
    name: string;
}
