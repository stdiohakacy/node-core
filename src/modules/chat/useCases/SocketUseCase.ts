import { MessageError, SystemError } from "../../../shared/exceptions/SystemError";
import { UserAuthenticated } from "../../auth/useCases/command/authenticate/AuthenticateResponse";
import { UserDb } from "../../user/infra/databases/typeorm/entities/UserDb";
import { CreateChannelCommandDTO } from "../dtos/CreateChannelCommandDTO";
import { ChannelDb } from "../infra/databases/typeorm/entities/ChannelDb";
import { ChannelUserDb } from "../infra/databases/typeorm/entities/ChannelUserDb";
import { SocketServiceRepoContext } from "./SocketServiceRepoContext";

export const updateUserSocketId = async (userId: string, socketId: string): Promise<boolean> => {
    const { userRepository } = SocketServiceRepoContext.getInstance();

    const user = await userRepository.getById(userId)
    if (!user)
        throw new Error('User not found')
    const socketIds = user.socketIds
    const newSocketIds = socketIds ? `${socketIds},${socketId}` : socketId

    const userDb = new UserDb()
    userDb.socketIds = newSocketIds

    const isUpdatedSocketId = await userRepository.update(userId, userDb)
    if (!isUpdatedSocketId)
        throw new Error('Update socket id of user cant not saved')
    console.log(`Init Socket For User ${userId} => Time: ${new Date().toLocaleString()}`)

    return !!isUpdatedSocketId
}

export const createChannel = async (
    input: CreateChannelCommandDTO,
    fromUserId: string
): Promise<ChannelDb> => {
    const { channelRepository, channelUserRepository } = SocketServiceRepoContext.getInstance();

    let userIds = (fromUserId ? [fromUserId] : []).concat(input.userIds || [])
    userIds = Array.from(new Set(userIds))

    if(!input)
        throw new SystemError(MessageError.PARAM_REQUIRED, 'channel')

    const channelDb = new ChannelDb()
    channelDb.name = input.name
    channelDb.description = input.description
    channelDb.isDirect = userIds.length === 2
    channelDb.isPrivate = true

    try {
        const channelCreated = await channelRepository.createGet(channelDb)
        if(!channelCreated)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE)
        const listChannelUsers: ChannelUserDb[] = []

        let channelUserDb = new ChannelUserDb()
        for (let i = 0; i < userIds.length; i++) {
            channelUserDb.channelId = channelCreated.id
            channelUserDb.userId = userIds[i]
            listChannelUsers.push(channelUserDb)
        }
        try {
            const channelUsersCreated = await channelUserRepository.createMultiple(listChannelUsers)
            if(!channelUsersCreated)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE)
        } catch (error) {
            console.error(error)
            throw new SystemError(MessageError.SOMETHING_WRONG)
        }

        return channelCreated
    } catch (error) {
        console.error(error)
        throw new SystemError(MessageError.SOMETHING_WRONG)
    }
}

export const getSingleChannel = async (toUserId: string, fromUserId: string): Promise<any> => {
    const { channelRepository } = SocketServiceRepoContext.getInstance();
    const channel = await channelRepository.getExistedSingleChannel(fromUserId, toUserId)
    if (!channel)
        return await createChannel({userIds: [toUserId]}, fromUserId)
    return channel
}
