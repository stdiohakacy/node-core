import { Service } from 'typedi';
import { BaseRepository } from '../../../shared/repository/BaseRepository';
import { IBaseRepository } from "../../../shared/repository/IBaseRepository";
import { ChannelUserDb } from '../infra/databases/typeorm/entities/ChannelUserDb';

export interface IChannelUserRepository extends IBaseRepository<ChannelUserDb, string> {}

@Service('channel_user.repository')
export class ChannelUserRepository extends BaseRepository<ChannelUserDb, string> implements IChannelUserRepository {
    constructor() {
        super(ChannelUserDb, {
            TABLE_NAME: 'channel_user'
        })
    }
}
