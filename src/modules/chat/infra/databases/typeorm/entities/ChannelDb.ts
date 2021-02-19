import { PrimaryGeneratedColumn } from 'typeorm';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../../../shared/infra/databases/typeorm/entity/BaseEntity';
import { ChannelUserDb } from './ChannelUserDb';

@Entity({ name: 'channel' })
export class ChannelDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @OneToMany(() => ChannelUserDb, channelUser => channelUser.channel)
    channelUsers: ChannelUserDb[];

    @Column({ name: 'name', type: 'varchar', nullable: true })
    name?: string;

    @Column({ name: 'description', type: 'varchar', nullable: true })
    description?: string;

    @Column({ name: 'is_direct', type: 'boolean', default: true })
    isDirect: boolean;

    @Column({ name: 'is_private', type: 'boolean', default: true })
    isPrivate: boolean;

    @Column({
        name: 'last_seen',
        type: 'simple-json',
        default: {},
    })
    lastSeen: Record<string, any>;

    @Column({ name: 'last_message_id', type: 'uuid', nullable: true })
    lastMessageId?: string;

    @Column({
        name: 'last_message_created_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
    })
    lastMessageCreatedAt?: Date;
}
