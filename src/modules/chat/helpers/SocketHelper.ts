import { PrivateMessageDb } from './../infra/databases/typeorm/entities/PrivateMessageDb';
import * as socketIO from 'socket.io'
import { SocketError } from '../../../shared/exceptions/SocketError';
import { MessageError } from '../../../shared/exceptions/SystemError';
import { UnauthorizedError } from '../../../shared/exceptions/UnauthorizedError';
import { ServiceRepositoriesContext } from '../../../shared/repository/ServiceRepositoryContext';
import { UserDb } from '../../user/infra/databases/typeorm/entities/UserDb';
import { GroupDb } from '../infra/databases/typeorm/entities/GroupDb';
import * as uuid from 'uuid';
import { GroupUserDb } from '../infra/databases/typeorm/entities/GroupUserDb';
import { GroupMessageDb } from '../infra/databases/typeorm/entities/GroupMessageDb';

export function emitAsync(socket, emitName, data, callback) {
    return new Promise((resolve, reject) => {
        if (!socket || !socket.emit) {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject('pls input socket');
        }
        socket.emit(emitName, data, (...args) => {
            let response;
            if (typeof callback === 'function') {
                response = callback(...args);
            }
            resolve(response);
        });
    });
}

export const verifySocketIO = (token: string, next): string => {
    const { redisAuthService } = ServiceRepositoriesContext.getInstance();

    let tokenDecoded
    try {
        tokenDecoded = redisAuthService.decodeJWT(token)
    }
    catch (error) {
        if (error.name === 'TokenExpiredError')
            throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token')
        else
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token')
    }
    if (!tokenDecoded || !tokenDecoded.sub)
        throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token')
    console.log('Verify socket token success')
    return next()
}

export const checkSpamSocket = (socketId: string, next) => {
    if (!socketRequestFrequency(socketId))
        return next()
    throw new SocketError(MessageError.TOO_MANY_REQUEST)
}

export const updateUserSocketId = async (userId: string, socketId: string): Promise<boolean> => {
    const { userRepository } = ServiceRepositoriesContext.getInstance();

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

export const savePrivateMessage = async (userId: string, data: any): Promise<void> => {
    const { privateMessageRepository } = ServiceRepositoriesContext.getInstance();

    const privateMsgDb = new PrivateMessageDb()
    privateMsgDb.fromUserId = userId
    privateMsgDb.toUserId = data.toUserId
    privateMsgDb.message = data.message
    try {
        const isCreated = await privateMessageRepository.create(privateMsgDb)
        if(!isCreated)
            throw new Error(`Data cannot save`)
    } catch (error) {
        console.error(error)
    }
}

export const saveAndJoinGroup = async (userId: string, data: any, socket: socketIO.Socket): Promise<string> => {
    const { groupRepository, groupUserRepository } = ServiceRepositoriesContext.getInstance()

    const toGroupId = uuid.v4()
    
    const groupDb = new GroupDb()
    groupDb.creatorId = userId
    groupDb.name = data.name
    groupDb.notice = data.notice
    groupDb.toGroupId = toGroupId

    const groupUserDb = new GroupUserDb()
    groupUserDb.toGroupId = toGroupId
    groupUserDb.userId = userId

    await Promise.all([
        await groupRepository.create(groupDb),
        await groupUserRepository.create(groupUserDb)
    ])
    socket.join(toGroupId)
    return toGroupId
}

export const emitSocketToUser = async (io: socketIO.Server, data): Promise<void> => {
    const { userRepository } = ServiceRepositoriesContext.getInstance();

    const toUser = await userRepository.getById(data.toUserId)
    const toUserSocketIds = (toUser.socketIds && toUser.socketIds.split(',') || [])

    toUserSocketIds.forEach(toUserSocketId => io.to(toUserSocketId).emit('listen-private-message', data))
}

export const sendGroupMessage = async (userId: string, data: any, socket: socketIO.Socket): Promise<void> => {
    const { groupMessageRepository } = ServiceRepositoriesContext.getInstance();

    const groupMessageDb = new GroupMessageDb()

    groupMessageDb.fromUserId = userId
    groupMessageDb.toGroupId = data.toGroupId
    groupMessageDb.message = data.message


    try {
        const isCreated = await groupMessageRepository.create(groupMessageDb)
        if(!isCreated)
            throw new Error(`Data cannot save`)
        socket.broadcast.to(data.toGroupId).emit('listen-group-message', data)
    } catch (error) {
        console.error(error)
    }
}

export const joinGroup = async (data, socket: socketIO.Socket): Promise<void> => {
    const { groupUserRepository } = ServiceRepositoriesContext.getInstance();

    const isJoined = await groupUserRepository.isIntoGroup(data.userId, data.toGroupId)
    if(!isJoined) {
        // join
        const groupUserDb = new GroupUserDb()
        groupUserDb.userId = data.userId
        groupUserDb.toGroupId = data.toGroupId
        
        const joinedGroupCreated = await groupUserRepository.create(groupUserDb)
        if(!joinedGroupCreated)
            throw new Error(`Data cannot save`)
        
        socket.broadcast.to(data.toGroupId).emit('listen-group-message', {
            ...data,
            message: `${data.userId} just joined group`,
            toGroupId: data.toGroupId,
            tip: 'joinGroup'
        })
    }
    socket.join(data.toGroupId)
}

let timeStamp = Date.parse(new Date().toString())
let limitCount = {}
export const socketRequestFrequency = socketId => {
    const now = Date.parse(new Date().toString())
    if (now - timeStamp > 60000) {
        limitCount = {}
        timeStamp = now
        return false
    }

    if (limitCount[socketId] > 30) return true
    limitCount[socketId] = (limitCount[socketId] || 0) + 1
    return false
}
