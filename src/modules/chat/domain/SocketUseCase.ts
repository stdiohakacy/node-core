import { UpdateChannelCommandDTO } from './dtos/UpdateChannelCommandDTO';
import { AES, enc } from 'crypto-js';
import { MessageError, SystemError } from "../../../shared/exceptions/SystemError";
import { CreateChannelCommandDTO } from "./dtos/CreateChannelCommandDTO";
import { SocketServiceRepoContext } from "./SocketServiceRepoContext";
import { MESSAGE_TYPE } from './definition/MessageType';
import { CreateMessageCommandDTO } from './dtos/CreateMessageCommandDTO';
import { Socket } from 'socket.io';
import { UserDb } from '../../../infra/UserDb';
import { ChannelDb } from '../../../infra/ChannelDb';
import { ChannelUserDb } from '../../../infra/ChannelUserDb';
import { MessageDb } from '../../../infra/MessageDb';

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

    if (!input)
        throw new SystemError(MessageError.PARAM_REQUIRED, 'channel')

    const channelDb = new ChannelDb()
    channelDb.name = input.name
    channelDb.description = input.description
    channelDb.isDirect = userIds.length === 2
    channelDb.isPrivate = true

    try {
        const channelCreated = await channelRepository.createGet(channelDb)
        if (!channelCreated)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE)
        const listChannelUsers: ChannelUserDb[] = []

        for (let i = 0; i < userIds.length; i++) {
            const channelUserDb = new ChannelUserDb()
            channelUserDb.channelId = channelCreated.id
            channelUserDb.userId = userIds[i]
            listChannelUsers.push(channelUserDb)
        }
        try {
            const channelUsersCreated = await channelUserRepository.createMultiple(listChannelUsers)
            if (!channelUsersCreated)
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

export const getSingleChannel = async (toUserId: string, fromUserId: string, socket: Socket): Promise<ChannelDb> => {
    const { channelRepository } = SocketServiceRepoContext.getInstance();
    const channel = await channelRepository.getExistedSingleChannel(fromUserId, toUserId)
    if (!channel) {
        const channelCreated = await createChannel({ userIds: [toUserId] }, fromUserId)
        socket.join(channelCreated.id)
        return channelCreated
    }
    socket.join(channel.id)
    return channel
}

export const createMessage = async (
    input: CreateMessageCommandDTO,
    fromUserId: string,
    socket: Socket
): Promise<MessageDb> => {
    const {
        channelRepository,
        messageRepository,
    } = SocketServiceRepoContext.getInstance()
    const { channelId, content } = input

    const isChannelExist = await channelRepository.isChannelExist(channelId)
    if (!isChannelExist)
        throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'channel')

    const messageDb = new MessageDb()
    messageDb.channelId = channelId
    messageDb.content = content
    messageDb.type = MESSAGE_TYPE.CHAT
    messageDb.userId = fromUserId

    const messageCreated = await messageRepository.createGet(messageDb)
    if (!messageCreated)
        throw new SystemError(MessageError.DATA_CANNOT_SAVE)

    const channelDb = new ChannelDb()
    channelDb.lastMessageCreatedAt = new Date()
    channelDb.lastMessageId = messageCreated.id
    const isUpdated = await channelRepository.update(channelId, channelDb)

    if (!isUpdated)
        throw new SystemError(MessageError.DATA_CANNOT_SAVE)

    socket.broadcast
        .to(channelId)
        .emit('receive-message', input)
    return messageCreated
}

export const getChannelsByUser = async (fromUserId: string, input: any, socket: Socket) => {
    const { channelRepository } = SocketServiceRepoContext.getInstance()
    const [channels, count] = await channelRepository.getChannelsByUser(fromUserId, input)
    channels.forEach(channel => socket.join(channel.id))
    return [channels, count]
}

export const readChannel = async (
    channelId: string,
    fromUserId: string,
    socket: Socket
): Promise<ChannelDb> => {
    const {
        messageRepository,
        channelRepository,
    } = SocketServiceRepoContext.getInstance()
    const [channel, message] = await Promise.all([
        channelRepository.getChannelById(channelId, fromUserId),
        messageRepository.getMessageNotOwned(channelId, fromUserId)
    ])

    if (!channel)
        throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'channel')

    if (!message)
        return channel

    const channelDb = new ChannelDb()
    channelDb.lastSeen = {
        ...channel.lastSeen || {},
        [fromUserId]: message.id
    }

    try {
        const channelUpdated = await channelRepository.update(channel.id, channelDb)
        if (!channelUpdated)
            throw new SystemError(MessageError.DATA_CANNOT_SAVE)

        socket.broadcast.to(channelId).emit('receive-read-channel', channel)
    } catch (error) {
        console.error(error)
        throw new SystemError(MessageError.SOMETHING_WRONG)
    }
    return channel
}

export const updateChannel = async (channelId: string, input: UpdateChannelCommandDTO, socket: Socket): Promise<boolean> => {
    const { name, lastMessageId, description, isPrivate } = input
    const { channelRepository } = SocketServiceRepoContext.getInstance()

    try {
        const isExist = await channelRepository.isChannelExist(channelId)
        if (!isExist)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'channel')

        const channelDb = new ChannelDb()
        if (name)
            channelDb.name = name
        if (lastMessageId)
            channelDb.lastMessageId = lastMessageId
        if (description)
            channelDb.description = description
        if (isPrivate)
            channelDb.isPrivate = isPrivate

        try {
            const isUpdated = await channelRepository.update(channelId, channelDb)
            if (!isUpdated)
                throw new SystemError(MessageError.DATA_CANNOT_SAVE)
            socket.broadcast.to(channelId).emit('receive-update-channel', isUpdated)
            
            return isUpdated
        } catch (error) {
            console.error(error)
            throw new SystemError(MessageError.SOMETHING_WRONG)
        }
    } catch (error) {
        console.error(error)
        throw new SystemError(MessageError.SOMETHING_WRONG)
    }
}

export const deleteChannel = async (channelId: string, socket: Socket) => {
    const { 
        channelRepository, 
        channelUserRepository 
    } = SocketServiceRepoContext.getInstance()
    
    try {
        const isExist = await channelRepository.isChannelExist(channelId)
        if(!isExist)
            throw new SystemError(MessageError.PARAM_NOT_EXISTS, 'channel')
        try {
            const isDeleted = await channelUserRepository.deleteByChannelId(channelId)

            if(isDeleted) {
                const isDeleted = await channelRepository.delete(channelId)
                socket.leave(channelId)
                return isDeleted
            }
        } catch (error) {
            console.error(error)
        throw new SystemError(MessageError.SOMETHING_WRONG)
        }
    } catch (error) {
        console.error(error)
        throw new SystemError(MessageError.SOMETHING_WRONG)
    }
}
