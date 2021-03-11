import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../shared/infra/databases/typeorm/entity/BaseEntity";
import { CategoryDb } from "./CategoryDb";

@Entity('product')
export class ProductDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId!: string;

    @ManyToOne(() => CategoryDb, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryDb;

    @Column({ name: 'name', length: 150 })
    name: string;

    @Column({ name: 'price', type: 'integer' })
    price: number;
}
