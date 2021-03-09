import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { ProductDb } from "../../../../../product_bk/infra/databases/typeorm/entities/ProductDb";

@Entity('category')
export class CategoryDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;
    
    @OneToMany(() => ProductDb, products => products.category)
    products?: ProductDb[]
}
