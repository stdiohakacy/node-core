import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { UserDb } from "../../../../../user/infra/databases/typeorm/entities/UserDb";

@Entity('group')
export class GroupDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @Column({ name: 'user_id', type: 'uuid' })
    creatorId: string;

    @ManyToOne(() => UserDb, creator => creator.groups)
    @JoinColumn({ name: 'user_id' })
    creator: UserDb;

    @Column({ name: 'name', length: 20, nullable: false, default: '' })
    name: string;

    @Column({ name: 'notice', length: 100, nullable: false, default: '' })
    notice: string;

    @Column({ name: 'to_group_id', length: 100 })
    toGroupId: string;
}
