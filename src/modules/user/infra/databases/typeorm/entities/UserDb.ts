import { DateTransformer } from './../transformers/DateTransformer';
import { GenderType } from './../../../../enums/GenderType';
import { UserStatusType } from '../../../../enums/UserStatusType';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../../../../../../shared/infra/databases/typeorm/entity/BaseEntity";
import { GroupDb } from '../../../../../chat/infra/databases/typeorm/entities/GroupDb';
import { GroupMessageDb } from '../../../../../chat/infra/databases/typeorm/entities/GroupMessageDb';
import { GroupUserDb } from '../../../../../chat/infra/databases/typeorm/entities/GroupUserDb';
import { PrivateMessageDb } from '../../../../../chat/infra/databases/typeorm/entities/PrivateMessageDb';
import { FromUserToUserDb } from '../../../../../chat/infra/databases/typeorm/entities/FromUserToUserDb';

@Entity('user')
export class UserDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @OneToMany(() => GroupDb, groups => groups.creator)
    groups: GroupDb[]

    @OneToMany(() => GroupMessageDb, groupMessages => groupMessages.fromUser)
    groupMessages?: GroupMessageDb[]

    @OneToMany(() => GroupUserDb, groupUsers => groupUsers.user)
    groupUsers?: GroupUserDb[]

    @OneToMany(() => PrivateMessageDb, privateMessages => privateMessages.fromUser)
    frU_privateMessages?: PrivateMessageDb[]

    @OneToMany(() => PrivateMessageDb, privateMessages => privateMessages.toUser)
    toU_privateMessages?: PrivateMessageDb[]

    @OneToMany(() => FromUserToUserDb, toU_fromUsersToUsers => toU_fromUsersToUsers.toUser)
    toU_fromUsersToUsers?: FromUserToUserDb[]

    @OneToMany(() => FromUserToUserDb, frU_fromUsersToUsers => frU_fromUsersToUsers.fromUser)
    frU_fromUsersToUsers?: FromUserToUserDb[]

    @Column('enum', { name: 'status', enum: UserStatusType, default: UserStatusType.ACTIVED })
    status: UserStatusType;

    @Column({ name: 'first_name', length: 20 })
    firstName: string;

    @Column({ name: 'last_name', length: 20, nullable: true })
    lastName?: string;

    @Column({ name: 'email', length: 120 })
    email: string;

    @Column({ name: 'password', length: 120 })
    password: string;

    @Column({ name: 'avatar', length: 200, nullable: true })
    avatar?: string;

    @Column('enum', { name: 'gender', enum: GenderType, nullable: true })
    gender?: GenderType;
    
    @Column('date', { name: 'birthday', nullable: true, transformer: new DateTransformer() })
    birthday?: Date;

    @Column({ name: 'phone', length: 20, nullable: true })
    phone?: string;

    @Column({ name: 'address', length: 200, nullable: true })
    address?: string;

    @Column({ name: 'culture', length: 5, nullable: true })
    culture?: string;

    @Column({ name: 'currency', length: 3, nullable: true })
    currency?: string;

    @Column({ name: 'active_key', length: 64, nullable: true })
    activeKey?: string;

    @Column('timestamptz', { name: 'active_expire', nullable: true })
    activeExpire?: Date;

    @Column('timestamptz', { name: 'actived_at', nullable: true })
    activedAt?: Date;

    @Column('timestamptz', { name: 'archived_at', nullable: true })
    archivedAt?: Date;

    @Column({ name: 'forgot_key', length: 64, nullable: true })
    forgotKey?: string;

    @Column('timestamptz', { name: 'forgot_expire', nullable: true })
    forgotExpire?: Date;

    @Column({name: 'socket_id', nullable: true, default: '', type: 'text'})
    socketIds: string
}
