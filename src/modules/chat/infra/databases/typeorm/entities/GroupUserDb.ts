import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { UserDb } from "../../../../../user/infra/databases/typeorm/entities/UserDb";

@Entity('group_user')
export class GroupUserDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => UserDb, user => user.groupUsers)
    @JoinColumn({ name: 'user_id' })
    user: UserDb;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string

    @Column({ name: 'to_group_id', length: 100, nullable: false, default: '' })
    toGroupId: string
}
