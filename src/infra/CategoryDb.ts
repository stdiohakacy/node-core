import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { ProductDb } from "./ProductDb";

@Entity('category')
export class CategoryDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id!: string;

    @Column({ name: 'name', length: 150 })
    name!: string;
    
    @OneToMany(() => ProductDb, products => products.category)
    products?: ProductDb[]
}
