import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { UserDb } from "../../../../../user/infra/databases/typeorm/entities/UserDb";

@Entity('group_message')
export class GroupMessageDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => UserDb, fromUser => fromUser.groupMessages)
    @JoinColumn({ name: 'from_user_id' })
    fromUser: UserDb;

    @Column({ name: 'from_user_id', type: 'uuid' })
    fromUserId: string

    @Column({ name: 'to_group_id', length: 100, nullable: false, default: '' })
    toGroupId: string

    @Column({ name: 'message', type: 'text', nullable: false, default: '' })
    message: string;

    @Column({name: 'attachments', type: 'simple-array', default: [], nullable: true})
    attachments: string[]
}
