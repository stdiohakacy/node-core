import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { ProductDb } from "./ProductDb";
import { TagDb } from "./TagDb";

@Entity({ name: 'product_tag' })

export class ProductTagDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => ProductDb, product => product.productTags)
    @JoinColumn({ name: 'product_id' })
    product: ProductDb;

    @ManyToOne(() => TagDb, tag => tag.productTags)
    @JoinColumn({ name: 'tag_id' })
    tag: TagDb;
    
    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'tag_id', type: 'uuid' })
    tagId: string;
}
