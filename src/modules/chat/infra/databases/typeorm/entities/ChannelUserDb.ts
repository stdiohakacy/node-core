import { PrimaryGeneratedColumn } from 'typeorm';
import { ChannelDb } from './ChannelDb';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../../../../shared/infra/databases/typeorm/entity/BaseEntity';
import { UserDb } from '../../../../../user/infra/databases/typeorm/entities/UserDb';

@Entity({ name: 'channel_user' })
export class ChannelUserDb extends BaseEntity {
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => ChannelDb, channel => channel.channelUsers)
    @JoinColumn({ name: 'channel_id' })
    channel: ChannelDb;

    @ManyToOne(() => UserDb, user => user.channelUsers)
    @JoinColumn({ name: 'user_id' })
    user: UserDb;

    @Column({ name: 'channel_id', type: 'uuid' })
    channelId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'is_mute', type: 'boolean', default: false })
    isMute: boolean;
}
