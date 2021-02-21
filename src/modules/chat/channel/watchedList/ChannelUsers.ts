import { WatchedList } from "../../../../shared/domain/WatchedList"
import { ChannelUser } from "../domain/entity/ChannelUser"

export class ChannelUsers extends WatchedList<ChannelUser> {
    private constructor(initialChannelUser: ChannelUser[]) {
        super(initialChannelUser)
    }
    
    public compareItems(a: ChannelUser, b: ChannelUser): boolean {
        return a.equals(b)
    }

    public static create(channelUsers?: ChannelUser[]): ChannelUsers {
        return new ChannelUsers(channelUsers || [])
    }
}
